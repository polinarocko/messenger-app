let username = document.querySelector("#username")
let password = document.querySelector("#password")
let confirmbutton = document.querySelector('#confirmbutton')
let result = document.querySelector("#result")

confirmbutton.onclick = async function name() {
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        }),
    })
    const data = await response.json()

    if (response.ok){
        localStorage.setItem("token", data.token)
        result.innerHTML = "log in was successful ("+data.token+")!"
        window.location.href = '/profile.html'
        
    }
    else{
        result.innerHTML = data.error
    }

}