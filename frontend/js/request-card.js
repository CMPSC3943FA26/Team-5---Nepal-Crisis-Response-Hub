function createRequestSubmitter(request) {
    const row = document.createElement("p");
    row.className = "request-submitter";
    const label = document.createElement("strong");
    const account = document.createElement("span");

    setInterfaceText(label, "Submitted by");
    if (request.userEmail) {
        account.textContent = request.userEmail;
    } else {
        setInterfaceText(account, "Guest (no account)");
    }
    row.append(label, ": ", account);
    return row;
}
