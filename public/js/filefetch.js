fetch("/api/userId")
    .then(response=>response.json())
    .then(data=>{
        console.log("Recieved JSON: ",data);
        document.getElementById("id").innerHTML=data.items.map(item=>`<li>${item}</li>`).join("");
        document.getElementById("title").innerHTML=data.items.map(item=>`<li>${item}</li>`).join("");
        document.getElementById("completed").innerHTML=data.items.map(item=>`<li>${item}</li>`).join("");
    })
    .catch(error=>{
        console.error("Error fetching data: ",error);
    });