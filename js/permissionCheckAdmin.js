if(sessionStorage.getItem("username") == null) {
    window.location.href = "../view/index.html";
}else {
    if(sessionStorage.getItem("x") == null) {
        window.location.href = "../view/index.html";
    }
}
