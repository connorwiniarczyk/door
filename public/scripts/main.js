const post = function(url, data){
	return new Promise((resolve, reject) => {
		const Http = XMLHttpRequest()
		Http.open("POST", )
	})
}

function adjust_textarea(h) {
    h.style.height = "20px";
    h.style.height = (h.scrollHeight)+"px";
}

const newDJ = function() {
	document.getElementById("new-dj-form")
	.classList.remove("hidden")

	document.getElementById("new-dj-button")
	.classList.add("hidden")

	console.log("Please Scan Checkpoint")
}

const scan = function(){
	document.getElementById("scan-button")
	.classList.add("hidden")

	document.getElementById("loading")
	.classList.remove("hidden")

	window.fetch("/scanner/next")
	.then(res => res.text())
	.then(function(id){
		document.getElementById("loading")
		.classList.add("hidden")

		document.getElementById("id")
		.classList.remove("hidden")

		document.getElementById("id")
		.value = id
	})
}

window.onload = function(){
	document.getElementById("form-submit")
	.addEventListener("click", function(){
		let data = {}

		document.querySelectorAll("form > label > input")
		.forEach(node => data[node.name] = node.value)

		delete data[""]

		data.accessgroup = "dj"

		fetch("/register", {
			headers: {
				"password_hash": "iheartbengordon"
			},
			body: data,
			method: "POST"
		})
		.then(res => res.text())
		.then(function(response){
			console.log(response)
			document.getElementById("new-dj-form").reset()
			document.querySelectorAll(
				"#new-dj-form > label[for='id'] > input "
			).forEach(function(node){
				if(node.id == "scan-button") node.classList.remove("hidden")
				else node.classList.add("hidden")
			})
		})
	})
}

const test = function() {
	
	

	// let data = {
	// 	firstname: document.querySelector("")
	// }
}