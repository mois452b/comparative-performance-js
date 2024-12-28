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

onmessage = async (event) => {
    const { code, data } = event.data
    const result = await runTest({ code, data })
    postMessage(result)
}