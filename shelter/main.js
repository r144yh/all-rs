let pets = []; // 8
let fullPetsList = []; // 48
const request = new XMLHttpRequest();
request.open('GET', 'pets.json');

request.onload = () => {
    pets = JSON.parse(request.response);
console.log(pets)
    fullPetsList = (() => {
        let tempArr = [];

        for (let i = 0; i < 6; i++) {
            const newPets = pets;

            for (let j = pets.length; j > 0; j--) {
                let randInd = Math.floor(Math.random() * j);
                const rendElem = newPets.splice(randInd, 1)[0];
                newPets.push(rendElem);
            }

            tempArr = [...tempArr, ...newPets];
        }
        return tempArr;
    })();

    fullPetsList = sort863(fullPetsList);

    createPets(fullPetsList);

    for (let i = 0; i < (fullPetsList.length / 6); i++) {
        const stepList = fullPetsList.slice(i * 6, (i * 6) + 6);

        for (let j = 0; j < 6; j++) {
            stepList.forEach((item, ind) => {
                if (item.name === stepList[j].name && (ind !== j)) {
                    //document.querySelector("#pets__card").children[(i * 6) + j].style.border = '5px solid red'
                }
            })
        }
    }
}

const createPets = (petsList) => {
    const elem = document.querySelector("#main__pets__content");
    elem.innerHTML += createElement(petsList);
}
createElement = (petsList) => {
    let str = '';
    for (let i = 0; i < petsList.length; i++) {
        str += `<img src="${petsList[i].img}">`;
        document.getElementById(`mainpets${i}`).src = petsList[i].img;
        document.getElementById(`mainName${i}`).innerText = petsList[i].name;
    }
    return str;
}

request.send();

const sort863 = (list) => {
    list = sort6recuesively(list);

    return list;
}
const sort6recuesively = (list) => {
    const length = list.length;

    for (let i = 0; i < (length / 6); i++) {
        const stepList = list.slice(i * 6, (i * 6) + 6);

        for (let j = 0; j < 6; j++) {
            const duplicatedItem = stepList.find((item, ind) => {
                return item.name === stepList[j].name && (ind !== j)
            });

            if (duplicatedItem !== undefined) {
                const ind = (i * 6) + j;
                const which8OfList = Math.trunc(ind / 8);
                const elem = list.splice(ind, 1)[0];

                list.splice(which8OfList * 8, 0, elem);

                sort6recuesively(list);
            }
        }
    }

    return list;
}

let currentPage = 0;

document.querySelector("#mainPrevPage").addEventListener('click', (e) => {

    checkItemsPerPage();

    if (currentPage > 0) {
        currentPage--;
    } else {
        currentPage = fullPetsList.length / itemsPerPage - 1
    }

    elementOnPage(itemsPerPage, currentPage)
});

document.querySelector("#mainNextPage").addEventListener('click', (e) => {
    console.log('kek')
    checkItemsPerPage();
    console.log(currentPage)
    console.log(fullPetsList)
    console.log(fullPetsList.length)
    console.log(itemsPerPage)
    if (currentPage <= fullPetsList.length / itemsPerPage - 1) {
        currentPage++;
    } else if (currentPage === fullPetsList.length / itemsPerPage - 1) {
        currentPage = 0;
    }
    elementOnPage(itemsPerPage, currentPage);

});

let itemsPerPage;
const checkItemsPerPage = () => {
    if (document.querySelector("body").offsetWidth > 1280) {
        itemsPerPage = 3;
    }
    if (document.querySelector("body").offsetWidth > 768 && document.querySelector("body").offsetWidth < 1280) {
        itemsPerPage = 2;
    }
    if (document.querySelector("body").offsetWidth < 768) {
        itemsPerPage = 1;
    }
}

function elementOnPage(itemsPerPage, currentPage) {
    let index = itemsPerPage * currentPage;
    let ind = 0;
    for (let i = index; i < index + itemsPerPage; i++) {
        document.getElementById(`mainpets${ind}`).src = fullPetsList[i].img;
        document.getElementById(`mainName${ind}`).innerText = fullPetsList[i].name;
        ind++
    }
}