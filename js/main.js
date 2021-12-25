chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
	chrome.tabs.sendMessage(tabs[0].id,	{todo: "getData"}, (res) => {
		if(res.length > 0){
			//remove the error message
			document.querySelector('#errorMessage').remove()
			//create the download elements
			res.forEach((element, index) => {
				let li = document.createElement("li")
				let button = document.createElement("button")
				let img = document.createElement("img")
				img.src = element.imageURL
				img.classList = "image"
				button.innerText = "Download " + element.type
				button.classList = "btn btn-outline-danger"
				let text = document.createTextNode((index+1).toString()+'.')
				li.appendChild(text)
				li.appendChild(img)
				li.appendChild(button)
				
				// add event listeners to the buttons
				document.getElementById("downloads").appendChild(li)
				button.addEventListener("click", ()=>{
					chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
						chrome.tabs.sendMessage(tabs[0].id,	{
							todo: "saveImage", 
							downloadURL: res[index].downloadURL,
							type: res[index].type,
							index: index
						})
					})
				})
			});
			//for the save all button
			if(res.length == 1){
				document.querySelector('#downloadAllContainer').remove()
			}
			else{
				document.getElementById('saveButton').addEventListener("click", ()=>{
					chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
						chrome.tabs.sendMessage(tabs[0].id,	{
							todo: "saveAllImages",
							downloadURLs: res.map(i => i.downloadURL),
							index: res.length
						})
					})
				})
			}
		}
		else{
			//remove the download container just for visual appeal
			document.querySelector('#downloadContainer').remove()
			document.querySelector('#downloadAllContainer').remove()
		}
	})
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	//decide what to do based on the message
	if(request.download){
		document.querySelectorAll('button')[request.index].setAttribute('disabled', true)
	}
	else{
		document.querySelectorAll('button')[request.index].removeAttribute('disabled')
	}
})