# Edge (nginx, TLS, DNS)

`visualsofdsa.dev` is served by the shared edge nginx on the droplet, not by this repo.
The edge lives in the `server-edge` repo, checked out at `/opt/edge`. It owns ports 80/443,
the Cloudflare-only lockdown and TLS. This repo only ships its own vhost and joins the
`edge` Docker network.

```
Cloudflare → droplet :443 → edge-nginx ──edge network──→ visualsofdsa-web:3000
```

## What this repo provides

| File                                | Purpose                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `compose.prod.yml`                  | `web` joins `edge` with the alias `visualsofdsa-web`; no host ports.               |
| `nginx/visualsofdsa.conf`           | The full vhost (HTTPS, www → apex). Needs the certificate.                         |
| `nginx/visualsofdsa.bootstrap.conf` | HTTP-only vhost, used until the certificate exists.                                |
| `scripts/deploy.sh`                 | After starting `web`, installs the right vhost with `/opt/edge/bin/install-vhost`. |

`install-vhost` runs `nginx -t` first and restores the previous file on failure, so a bad vhost
never takes the other sites offline.

## First-time setup

1. **DNS (Cloudflare):** `A visualsofdsa.dev` and `A www` → the droplet IP, **proxied** (orange
   cloud). SSL/TLS mode **Full (strict)**.
2. **Deploy once** (push to `main`, or run `scripts/deploy.sh` on the droplet). With no
   certificate yet, it installs the bootstrap vhost.
3. **Issue the certificate** on the droplet, as root:

   ```bash
   certbot certonly --webroot -w /var/www/certbot \
     -d visualsofdsa.dev -d www.visualsofdsa.dev \
     --key-type ecdsa \
     --deploy-hook "docker exec edge-nginx nginx -s reload"
   ```

   The deploy hook is stored in `/etc/letsencrypt/renewal/visualsofdsa.dev.conf`, so renewals
   reload nginx too.
4. **Deploy again.** The certificate now exists, so the full HTTPS vhost is installed.
5. **Check:** `curl -I https://visualsofdsa.dev/` (expect 200) and `certbot renew --dry-run`.

If the challenge fails, check that Cloudflare's "Always Use HTTPS" is not redirecting
`/.well-known/acme-challenge/` before validation.
