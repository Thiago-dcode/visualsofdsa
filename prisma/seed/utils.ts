export type BigOType = '1' | 'n' | 'n^2' | 'log n' | 'n log n' | 'n^3' | '2^n' | 'n!' | 'n*n!' | '∞'

export const getComplexity = (bigO: BigOType) => {
  switch (bigO) {
    case '1':
      return 'Constant time operation'
    case 'n':
      return 'Linear time operation'
    case 'n^2':
      return 'Quadratic time operation'
    case 'log n':
      return 'Logarithmic time operation'
    case 'n log n':
      return 'Log-linear time operation'
    case 'n^3':
      return 'Cubic time operation'
    case '2^n':
      return 'Exponential time operation'
    case 'n!':
      return 'Factorial time operation'
    case 'n*n!':
      return 'n * factorial time operation'
    case '∞':
      return 'Infinite time operation'
    default:
      return bigO
  }
}
export const linkBuilder = (title: string, link: string) => {

  return `<a href="${link}" target="_blank" class="text-app-bauhaus-blue">${title}</a>`
}

export const buildDescription = ({ description,
  coreCharacteristics,
  keyOperations,
  commonApplications,
  extraInfo
}: {
  description: string,
  coreCharacteristics?: string[],
  keyOperations?: {
    operation: string,
    color: 'green' | 'yellow' | 'red' | 'blue' | 'indigo' | 'orange',
    description: string,

    averageCase: BigOType,
    worstCase: BigOType,
  }[],
  commonApplications?: string[],
  extraInfo?: string
}) => {

  const sectionClass = 'flex flex-col gap-1 items-start justify-start'
  const buildTtitleSection = (title: string) => {
    return `<h4 class="text-xl font-semibold flex items-center justify-start gap-2">${title}</h4>`
  }
  const buildBigO = (bigO: BigOType, complexity?: 'average' | 'worst',) => `<span class="bigO ${complexity}"><b>${complexity ? `<span class="capitalize">${complexity} case:</span>` : 'Complexity:'} O(${bigO})</b> - ${getComplexity(bigO)}</span>`
  const buildSection = (title: string, content: string[]) => {

    return `<section class="${sectionClass}">
      ${buildTtitleSection(title)}
      <ul class="ml-4 ">
        ${content.map(item => `<li class="flex items-start justify-start gap-2"> <i class="dot"></i><span>${item}</span></li>`).join('')}
      </ul>
  </section>`

  }

  return `<article class="flex flex-col gap-4 items-start justify-start module-description">
  <header class="w-full">
      <p class="leading-relaxed description-text">${description}</p>
  </header>

  ${coreCharacteristics ? buildSection('Core Characteristics', coreCharacteristics) : ''}

 ${keyOperations ? `<section class="${sectionClass} operations-section">
    ${buildTtitleSection('Key Operations')}
    <ul class="ml-4 flex flex-col gap-2 items-start justify-start">
    ${keyOperations.map(kp => {

    return `<li class="mb-4 operation-item">
       <p> <span><b class="font-semibold ${kp.color} capitalize  operation-title">${kp.operation}()</b> This operation ${kp.description}. </span> ${kp.averageCase === kp.worstCase ? buildBigO(kp.averageCase) : buildBigO(kp.averageCase, 'average') + buildBigO(kp.worstCase, 'worst')}</p>
      </li>`
  }).join('')}
    </ul>
  </section>`
      : ''}
 ${commonApplications ? buildSection('Common Applications', commonApplications) : ''}
 ${extraInfo || ''}
</article>`
};
