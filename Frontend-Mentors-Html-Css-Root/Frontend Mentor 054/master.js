let input = document.querySelector("input");
let summary = document.querySelector(".summary");
let number = document.querySelector(".number");
let count = 0;

document.forms[0].onsubmit = (e)=> {
    if(input.value !== ""){
    let list = document.createElement("p");
    let ball = document.createElement("span");
    let text = input.value;
    let button = document.createElement("button");

    ball.className = "ball";
    input.value = "";
    button.className = "b";
        if(svgs[0].classList.contains("appeare")){
            list.className = "list darkL";
        }
        else{
            list.className = "list lightL";
        }
    list.append(text,ball,button);
    summary.before(list);
    number.textContent = `${++count} item left`;
    }
    e.preventDefault();
}

//to active the ball or delete note
document.addEventListener("click",function(e){
    if(e.target.classList.contains("ball")){
        e.target.classList.toggle("actived");
    }
    else if(e.target.classList.contains("b")){
        e.target.parentElement.remove();
        number.textContent = `${--count} item left`;
    }
})

//check for completed notes and changing 
let completed = document.querySelector(".completed");
completed.addEventListener("click",function(){
    let balls = document.querySelectorAll(".ball");
    balls.forEach(function(ele,ind){
        if(!ele.classList.contains("actived")){
            ele.parentElement.style.display = "none";
            completed.style.color = "hsl(234, 39%, 85%)";
            document.querySelector(".all").style.color = "";
            clear.style.color = "";
        }
    })
})

//show all tasks
let all = document.querySelector(".all");
all.addEventListener("click",function(){
    let PPs = document.querySelectorAll(".list")
    PPs.forEach(function(ele){
        ele.style.display = "block";
        all.style.color = "hsl(234, 39%, 85%)";
        completed.style.color = "";
        clear.style.color = ""
    })
})

//cleare all tasks
let clear = document.querySelector(".clear");
clear.addEventListener("click",function(){
    let allCompleted = document.querySelectorAll(".actived")
    allCompleted.forEach(function(ele,ind){
            ele.parentElement.remove();
            clear.style.color = "hsl(234, 39%, 85%)";
            document.querySelector(".all").style.color = "";
            number.textContent = `${--count} item left`;
    })
})

//doing Dark-mode and Light-mode
let dark = document.querySelector("img[alt='dark']");
let light = document.querySelector("img[alt='light']");
let svgs = document.querySelectorAll(".upper svg");
let spans = document.querySelectorAll(".summary span");
svgs[0].onclick = () => {
    svgs[0].classList.toggle("appeare");
    svgs[0].classList.add("disappeare");
    svgs[1].classList.toggle("appeare");
    svgs[1].classList.remove("disappeare");
    dark.classList.toggle("appeare");
    dark.classList.add("disappeare");
    light.classList.toggle("appeare");
    light.classList.remove("disappeare");
    document.body.classList.remove("darkB");
    document.body.classList.add("lightB");
    document.forms[0][0].classList.remove("darkB");
    document.forms[0][0].classList.add("lightB");
    summary.classList.remove("darkL");
    summary.classList.add("lightL");
    for(i=0;i<5;i++){
        spans[i].classList.remove("darkS");
        spans[i].classList.add("lightS");
    }
    let lists = document.querySelectorAll(".list");
    lists.forEach(function(ele){
        ele.classList.remove("darkL");
        ele.classList.add("lightL");
    })
}
svgs[1].onclick = () => {
    svgs[1].classList.toggle("appeare");
    svgs[1].classList.add("disappeare");
    svgs[0].classList.toggle("appeare");
    svgs[0].classList.remove("disappeare");
    light.classList.toggle("appeare");
    light.classList.add("disappeare");
    dark.classList.toggle("appeare");
    dark.classList.remove("disappeare");
    document.body.classList.remove("lightB");
    document.body.classList.add("darkB");
    document.forms[0][0].classList.remove("lightB");
    document.forms[0][0].classList.add("darkB");
    summary.classList.remove("lightL");
    summary.classList.add("darkL");
    for(i=0;i<5;i++){
        spans[i].classList.add("darkS");
        spans[i].classList.remove("lightS");
    }
    let lists = document.querySelectorAll(".list");
    lists.forEach(function(ele){
        ele.classList.add("darkL");
        ele.classList.remove("lightL");
    })
}
