let usernameinput = document.querySelector("#username")
let passwordinput = document.querySelector("#password")
let confirmbutton = document.querySelector("#confirmbutton")
let result = document.querySelector("#result")

confirmbutton.onclick = async function(){
    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: usernameinput.value,
            password: passwordinput.value
        }),
    })
    const data = await response.json()
    if (response.ok){
        result.innerHTML = "sign up was successful ("+data.username+")!"
    }
    else{
        result.innerHTML = data.error
    }

}
