export function blurAll() {
  const inputs = document.querySelectorAll('input')
  inputs.forEach((input: HTMLInputElement) => {
    input.blur()
  })
}

export function focusNextInput(event: Event) {
  const currentInput = event.target as HTMLInputElement

  // Find all input elements within the component
  const inputs = Array.from(document.querySelectorAll('input'))

  // Get the index of the current input
  const currentIndex = inputs.indexOf(currentInput)

  // If there's a next input, focus it
  if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
    const nextInput = inputs[currentIndex + 1] as HTMLInputElement
    nextInput.focus()
  }
}
