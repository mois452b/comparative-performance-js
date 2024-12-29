import './style.css'

const $sendButton = document.querySelector(".run")
const $globalCode = document.querySelector<HTMLTextAreaElement>("#global")

async function runTest({ code, data }: { code: string, data: string }): Promise<number[]> {
  const worker = new Worker("src/worker.js")
  
  worker.postMessage({ code, data })
  worker.onerror = error => {
    console.log("error:", error)
  }

  return new Promise((resolve, _) => {
    worker.onmessage = (event) => {
      const result = event.data
      resolve(result)
    }
  })
}

function runTestCases() {
  const $testCases = document.querySelectorAll(".test-case")
  const globalCode = $globalCode?.value

  const $bars = document.querySelectorAll<HTMLDivElement>(".bar")
  $bars.forEach($bar => $bar.style.height = "0%")
  const $percentagesContainer = document.querySelector(".percentages")
  if( !$percentagesContainer ) return
  $percentagesContainer.innerHTML = ""

  const promises = [...$testCases].map(async ($testCase) => {
    const $code = $testCase.querySelector<HTMLTextAreaElement>(".code")
    const $ops = $testCase.querySelector(".ops")
    if( !$code || !$ops || !globalCode ) return
    const codeValue = $code?.value
    $ops.textContent = "Loading..."
    
    const result = await runTest({ code: codeValue, data: globalCode })
    $ops.textContent = `${result} ops/s`

    return result
  })
  
  Promise.all(promises).then(results => {
    const $barsContainer = document.querySelector(".bars")
    if( !$barsContainer ) return
    const maxValue = Math.max(...results as any)
    $barsContainer.innerHTML = ""
    results.forEach((result: any) => {
      const $bar = document.createElement("div")
      $bar.classList.add("bar")
      $barsContainer.appendChild($bar)
      $bar.style.height = "0%"
      setTimeout( () => $bar.style.height = `${(result / maxValue * 100).toFixed(0)}%`, 10)

      const $percentage = document.createElement("div")
      $percentage.textContent = `${(result / maxValue * 100).toFixed(0)}%`
      $percentagesContainer.appendChild($percentage)
    })

  })
}

$sendButton?.addEventListener("click", runTestCases)