let input = document.querySelector("#input")

async function loadProfile() {
    const token = localStorage.getItem("token")
    if (!token) {
        window.location.href = '/login.html'
        return;
    }
    try {
        const response = await fetch("/profile", {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        const data = await response.json()
        if (!response.ok) {
            localStorage.removeItem("token")
            window.location.href = '/login.html'
            return;
        }
        input.value = "Your id is: " + data.username;
        const usersResponse = await fetch("/users",{
            headers: {
                Authorization: "Bearer " + token
            }
        })
        const users = await usersResponse.json()
        let contacts = document.getElementsByClassName("sidebar")[0]
        for (let i = 0; i < users.length; i++){
            const button = document.createElement("button")
            let pfp = document.createElement("img")
            pfp.src = 'ogimg.jpeg'
            pfp.className = "pfp"
            let friendsUsers = document.createElement("h3")
            friendsUsers.innerHTML = users[i].username
            button.appendChild(pfp)
            button.appendChild(friendsUsers)
            contacts.appendChild(button)
        }

    }
    catch (error) {
        input.value = "Error: " + error.message
    }
}

const logout = document.getElementById("logout")
logout.onclick = function () {
    localStorage.removeItem("token")
    window.location.href = '/login.html'
}
loadProfile()

const sendMessage = document.getElementsByClassName("meow")[0]
sendMessage.onclick = async function(){

    const token = localStorage.getItem("token")
    const text = document.getElementById("input").value
    const recieverID = 2
    const response = await fetch("/message",{
        method: "POST",
        headers:{
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            recieverID: recieverID,
            text: text
        })
        
    })
}