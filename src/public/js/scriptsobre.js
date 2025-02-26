function validarImei() {
    const imei = document.getElementById("imei").value;
    const resultDiv = document.getElementById("result");

    resultDiv.style.display = "none";
    resultDiv.classList.remove("error");
    resultDiv.classList.remove("success");

    if (imei.length !== 15 || isNaN(imei)) {
        resultDiv.style.display = "block";
        resultDiv.classList.add("error");
        resultDiv.textContent = "IMEI inválido. Deve ter 15 números.";
        return;
    }

    if (imei.match(/^\d{15}$/)) {
        resultDiv.style.display = "block";
        resultDiv.classList.add("success");
        resultDiv.textContent = "IMEI válido!"
    } else {
        resultDiv.style.display = "block";
        resultDiv.classList.add("error");
        resultDiv.textContent = "IMEI inválido.";
    }
}
