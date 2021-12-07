let rootLink = 'http://127.0.0.1:5000/';

const articleTemplate = document
    .getElementById("template_list_element")
    .cloneNode(true);
//
articleTemplate.removeAttribute("id");
articleTemplate.setAttribute("class", "list_element");

const articleHeader = document.getElementById("article_header");
const articleImageLink = document.getElementById("article_image_link");
const articleText = document.getElementById("input_article_text");

const domArticlesList = document.getElementById('articles_list');
const sidebarArticleForm = document.getElementById('sidebar_article_form');
const inputArticleForm = document.getElementById('input_article_form');


let saveArticleButton = document.getElementById('save_article_button');
saveArticleButton.addEventListener('click', saveArticle);

const addArticleButton = document.getElementById("add_article_button");
addArticleButton.addEventListener('click', addArticle);


updateListOfArticles();


function readArticleForm() {
    return {
        'header': articleHeader.value,
        'image_link': articleImageLink.value,
        'text': articleText.value
    };
}

function status(response) {
    if (response.ok) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

async function getData(request) {
    return fetch(rootLink + request)
        .then(status)
        .then((response) => {
            return response.json()
        })
        .catch(function (err) {
            console.log(err);
        });
}

async function deleteData(request) {
    return fetch(rootLink + request, {
        method: 'DELETE',
    })
        .then(status)
        .catch(function (err) {
            console.log(err);
        });
}

async function sendData(request, data) {
    return fetch(rootLink + request, {
        method: 'POST',
        body: JSON.stringify(data || {}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(status)
        .catch(function (err) {
            console.log(err);
        })
}

async function addArticle(event) {
    showArticleFormBlock();
}

async function saveArticle(event) {
    let formData = readArticleForm();
    await sendData('article', formData);
    await updateListOfArticles();
}

async function clickListElement(event) {
    let clickedElement = event.target;
    if (clickedElement.classList.contains('select_page_button')) {
        highlightArticle(clickedElement.parentNode);
        hideArticles();
        await showArticle(clickedElement);
    }
}

async function deleteArticle(event) {
    let currentHighlighted = domArticlesList.querySelector(".highlighted > .select_page_button");
    let highlightedId = currentHighlighted.getAttribute('data-article-id');
    if (highlightedId) {
        await deleteData(`article?id=${highlightedId}`);
        await updateListOfArticles();
    }
}

function hideArticles() {
    let articles = domArticlesList.getElementsByClassName('article_block');
    for (let article of articles) {
        article.style.display = 'none';
    }
}

function highlightArticle(articleElement) {
    if (!articleElement) return;

    let currentHighlighted = domArticlesList.querySelector(".highlighted");

    if (currentHighlighted) {
        currentHighlighted.classList.remove('highlighted');
    }

    articleElement.classList.add('highlighted');
}

function showInSidebar(clickedBlock) {
    let sidebarCopy = clickedBlock
        .querySelector(".article_block")
        .cloneNode(true);

    sidebarCopy.style.display = "";

    sidebarCopy.querySelector(".delete_article_button")
        .addEventListener('click', deleteArticle);

    let oldElement = sidebarArticleForm.querySelector(".article_block");

    if (oldElement) {
        sidebarArticleForm.removeChild(oldElement);
    }

    sidebarArticleForm.appendChild(sidebarCopy);
}

async function showArticle(clickedElement) {
    let articleId = clickedElement.getAttribute('data-article-id');

    let clickedBlock = clickedElement.parentNode;

    showArticleBlock(clickedBlock);

    let article = await getData(`article?id=${articleId}`);

    setArticleData(clickedBlock, article);

    showInSidebar(clickedBlock);
}

function createListElement(article) {
    let newArticle = articleTemplate.cloneNode(true);

    let selectPageButton = newArticle.querySelector('.select_page_button');
    selectPageButton.setAttribute('data-article-id', article.id);
    selectPageButton.innerText = article.header;

    newArticle
        .querySelector(".delete_article_button")
        .addEventListener('click', deleteArticle);

    return newArticle
}

function setArticleData(domNode, article) {
    let articleContent = domNode.querySelector(".article");

    let image = articleContent.querySelector(".article_image");
    image.setAttribute("src", article.image_link);

    let articleText = articleContent.querySelector(".article_text");
    articleText.innerText = article.text;
}

function showListOfArticles(articlesList) {
    articlesList.forEach((item) => {
        let listElement = createListElement(item);
        domArticlesList.appendChild(listElement);
    });
}

function clearListArticles() {
    let domArticles = domArticlesList.getElementsByClassName('list_element');

    Array.from(domArticles)
        .forEach(article => article.parentNode.removeChild(article))
}

function showArticleFormBlock(clickedElement) {
    inputArticleForm.style.display = '';
    sidebarArticleForm.style.display = 'none';
}

function showArticleBlock(clickedElement) {
    sidebarArticleForm.style.display = '';
    inputArticleForm.style.display = 'none';
}

async function updateListOfArticles() {
    let articlesList = await getData('articles');

    clearListArticles();

    if (articlesList !== undefined && articlesList.length !== 0) {

        showListOfArticles(articlesList);

        domArticlesList
            .querySelectorAll('.select_page_button')
            .forEach(it => it.addEventListener('click', clickListElement));

        // await showHighlightedArticle(htmlList, currentHighlighted);
    } else {
        showArticleFormBlock();
    }
}


//

//

//

//

//
// async function clickListElement(event) {
//     let clickedElement = event.target;
//     if (clickedElement.classList.contains('select_page_button')) {
//         highlightArticle(clickedElement);
//         hideArticles();
//         await showArticle(clickedElement);
//     }
// }
//

//

// async function showHighlightedArticle(htmlList, highlightedArticle) {
//     let article;
//
//     if (highlightedArticle) {
//         let id = highlightedArticle.getAttribute('data-article-id');
//         article = htmlList.querySelector(`[data-article-id='${id}']`);
//     }
//
//     if (!article) {
//         article = htmlList
//             .querySelector('li:not([class*=\'template_list_element\']) div');
//     }
//
//     highlightArticle(article);
//
//     await showArticle(article)
// }