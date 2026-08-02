/**
 * Contact.js
 * Contact form handler. Integrates with Web3Forms external service.
 * Supports states: idle, submitting, success, error, missing configuration.
 *
 * Configuration:
 * - Replace Web3Forms Access Key placeholder with a real key.
 * - If key is missing/placeholder, form displays an honest missing-config warning.
 */

// OWNER ACTION: Replace this placeholder with a valid Web3Forms access key
// Obtain a free key from https://web3forms.com
const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY_HERE"

export class Contact {
  constructor() {
    this._form = document.getElementById('contact-form')
    this._submitBtn = document.getElementById('contact-submit')
    this._statusEl = document.getElementById('contact-status')

    if (!this._form) return

    this._setupUI()
    this._bind()
  }

  _setupUI() {
    // Check if configuration is missing (still placeholder)
    if (this._isConfigMissing()) {
      this._showStatus(
        "Contact form is currently offline (Missing Web3Forms Access Key). Please check instructions in 'src/ui/Contact.js'.",
        "warning"
      )
    }
  }

  _isConfigMissing() {
    return !WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.includes("YOUR_WEB3FORMS_ACCESS_KEY_HERE")
  }

  _bind() {
    this._form.addEventListener('submit', (e) => {
      e.preventDefault()
      this._handleSubmit()
    })
  }

  async _handleSubmit() {
    if (this._isConfigMissing()) {
      this._showStatus(
        "Cannot submit: Web3Forms Access Key is not configured. Portfolio owner must replace the placeholder in 'src/ui/Contact.js'.",
        "error"
      )
      return
    }

    // Set submitting state
    this._setSubmitting(true)
    this._showStatus("Sending message...", "info")

    const formData = new FormData(this._form)
    formData.append("access_key", WEB3FORMS_ACCESS_KEY)
    formData.append("subject", "New Portfolio Inquiry")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      })

      const result = await response.json()

      if (response.status === 200 && result.success) {
        this._showStatus("Message sent successfully! I will get back to you soon.", "success")
        this._form.reset()
      } else {
        throw new Error(result.message || "Submission failed")
      }
    } catch (error) {
      console.error("[Contact] Error submitting form:", error)
      this._showStatus(`Failed to send message: ${error.message}. Please try again later.`, "error")
    } finally {
      this._setSubmitting(false)
    }
  }

  _setSubmitting(isSubmitting) {
    if (this._submitBtn) {
      this._submitBtn.disabled = isSubmitting
      this._submitBtn.textContent = isSubmitting ? "SENDING..." : "SUBMIT"
    }
    // Disable form fields during submission
    const inputs = this._form.querySelectorAll('.contact-input')
    inputs.forEach(input => input.disabled = isSubmitting)
  }

  _showStatus(message, type) {
    if (!this._statusEl) return
    this._statusEl.textContent = message
    this._statusEl.className = `contact-status ${type}`
    this._statusEl.classList.add('visible')
  }
}
