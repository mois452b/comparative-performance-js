import './style.css'

const $sendButton = document.querySelector(".run")
const $globalCode = document.querySelector<HTMLTextAreaElement>("#global")

async function runTest({ code, data }) {
  const worker = new Worker("src/worker.js")
  
  worker.postMessage({ code, data })
  worker.onerror = error => {
    console.log("error:", error)
  }

  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      const result = event.data
      resolve(result)
    }
  })
}

function runTestCases() {
  const $testCases = document.querySelectorAll(".test-case")
  const globalCode = $globalCode?.value

  $testCases.forEach(async ($testCase) => {
    const $code = $testCase.querySelector<HTMLTextAreaElement>(".code")
    const $ops = $testCase.querySelector(".ops")
    if( !$code || !$ops ) return
    const codeValue = $code?.value
    $ops.textContent = "Loading..."
    
    const result = await runTest({ code: codeValue, data: globalCode })
    $ops.textContent = `${result} ops/s`
  })
}

$sendButton?.addEventListener("click", runTestCases)