const form = document.querySelector("form");
const code = document.getElementById("code");
const feedback = document.querySelector(".invalid-feedback");
const search = new URLSearchParams(window.location.search)
const resendButton = document.getElementById('resend')
const resendInfo = document.getElementById('resend-info')

form.setAttribute('action', `/verify?userid=${search.get('userid')}`)

const listenerForInput = (text) => {
  code.addEventListener("input", function (e) {
    feedback.textContent = text;
    if (!/^\d{6}$/.test(this.value)) {
      this.classList.remove("is-valid");
      this.classList.add("is-invalid");
      this.setCustomValidity("Invalid");
    } else {
      this.classList.remove("is-invalid");
      this.classList.add("is-valid");
      feedback.textContent = "";
      this.setCustomValidity("");
    }
  });
};

if (feedback.textContent.trim() !== "") {
  code.setCustomValidity("Invalid");
  listenerForInput(feedback.textContent);
}

form.addEventListener("submit", function (e) {
  console.log(code.value);
  if (!/^\d{6}$/.test(code.value)) {
    e.preventDefault();
    form.classList.remove("needs-validation");
    form.classList.add("was-validated");
    code.classList.add("is-invalid");
    code.setCustomValidity("Invalid");
    feedback.textContent = "Code must be 6 digits";
    listenerForInput("Code Must Be 6 Digits");
  }
});

resendButton.addEventListener('click', async function(e){
  this.setAttribute('disabled', true)
  try {
    const verification = await fetch(`/resend?userid=${search.get('userid')}`, {
      method: 'POST',
      "Content-Type": 'application/json'
    })
  
    const { message } = await verification.json()

    if(verification.status !== 200) {
      throw new Error(message)
    }

    resendInfo.textContent = message

    setTimeout(() => {
      resendInfo.textContent = ''
    }, 6000)

  } catch(error) {
    const { message } = error
    resendInfo.textContent = message
  } finally {
    this.removeAttribute('disabled')
  }

})