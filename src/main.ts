import './style.css'

const $sendButton = document.querySelector(".run")
const $globalCode = document.querySelector<HTMLTextAreaElement>("#global")

async function runTest({ code, data }) {
  let duration = 1000
  let result = 0
  try {
    result = eval(`
      (async () => {
        let PERF__ops = 0
        const PERF__start = performance.now()
        const PERF__end = performance.now() + duration

        ${data}

        while(performance.now() < PERF__end) {
          ${code}
          PERF__ops++
        }

        return PERF__ops
      })()
    `)
  }
  catch( error ) {
    result = 0
  }

  return result
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
    console.log(result)
  })
}

$sendButton?.addEventListener("click", runTestCases)