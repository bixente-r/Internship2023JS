// THE CURRENT WORKING VERSION WITH COMMENTS :

// Get all div elements
let divElements = document.getElementsByTagName("div");

// Empty array to hold images and videos
let images = [];

// Iterate over all div elements
for(let i = 0; i < divElements.length; i++) {
    // Iterate over all child nodes of each div
    for(let j = 0; j < divElements[i].children.length; j++) {
        // Check if child node is an image or video
        if(divElements[i].children[j].tagName === 'IMG' || divElements[i].children[j].tagName === 'VIDEO') {
            images.push(divElements[i].children[j]);
        }
    }
}

// Define a function to pause execution for a specified amount of time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to simulate a mouseover event
async function mouseOver(element) {
    // Create a new mouseover event
    var event = new MouseEvent('mouseover', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });

    // Dispatch the event on the element
    element.dispatchEvent(event);
}

// Generate random number between 500 and 1000
function getRandomNumber() {
  return Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
}

// Object to store images that meet certain criteria
function getListOfPics(images) {
    
    console.log("Start getDictOfPics function... \n");
    
    // Object to store images that meet certain criteria
    var image_list = [];
    
    // Iterate through all images
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        var linkElement = image.closest('a'); // Get the closest 'a' element
        var imgSrc = image.src;
        
        // Check if the link element exists and its URL starts with a certain string and the image dimensions are adequate
        if (!imgSrc.startsWith('https://i.pinimg.com/75x75_RS/') && !imgSrc.startsWith('https://s.pinimg.com/') && !imgSrc.startsWith('https://pinterest.com/favicon.ico') && !imgSrc.startsWith('https://www.cheatlayer.com') && !imgSrc.startsWith('chrome-extension://') && !imgSrc.startsWith('https://pinterest/favicon.ico') && !imgSrc.startsWith('61: https://p/favicon.ico')) {//(linkElement && linkElement.href.startsWith('https://www.pinterest.fr/pin/') && (image.width >= 100 && image.height >= 100) {
          
          // If the conditions are met, add the image to the dictionary
          image_list[i] = image;
          
          console.log(imgSrc);
          // console.log(linkElement.href);
        }
    }
    
    image_list = image_list.filter(image => image !== undefined);
    
    var image_src = image_list.map(function(image) {
    return image.src;
    });
    
    
    // Log the number of images that met the conditions
    console.log("image list length : " + image_list.length);
    console.log("sources list length : " + image_src.length);
    
    if (image_list.length === image_src.length) {
        for (var i = 0; i < image_list.length; i++) {
            console.log(i + ": " + image_list[i]);
            console.log(i + ": " + image_src[i]);
            console.log("\n");
        }
    }
    return {imgList: image_list, imgSource: image_src};
}

async function useModel(jpgUrl, i) {
    console.log('Processing image index: ' + i);
    try {
        const response = await fetch('https://predict.cogniflow.ai/image/classification/predict-from-web/fdf9275a-27e2-4a45-afd8-96d42f41a924', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': '41c19be5-6e82-4128-bae4-7d5ce127754a'
            },
            body: JSON.stringify({"format":"jpg","url":jpgUrl}),
        });

        const data = await response.json();
        const resultValue = data.result;
        //console.log(resultValue);

        return resultValue;
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function classifyImage(url_list) {
    
    var goodImgId = [];
    for (var i = 0; i < url_list.length; i++){
        var imageUrl = url_list[i];
        try {
            let result = await useModel(imageUrl, i);
            console.log("Classification result : " + result + "\n");
            if (result === "good") {
                goodImgId.push(i); 
            }
        } catch (error) {
            console.error("An error occurred when calling useModel:", error);
        }
    }

    //console.log(goodImgId);
    return goodImgId;
}

function keepPicsToSave(image_list, goodImgId) {
   
    console.log("Start keepPicsToSave function... \n");
    image_list = image_list.filter((_, index) => goodImgId.includes(index));
};
    
// Function to simulate user interaction with the page
async function processAutomation(image_list, ID) {
    
    console.log("Start processAutomation function... \n");
    
    var savedPic = 0; // Counter for successfully clicked 'save' buttons
    
    console.log(ID + ": " + image_list[ID]); // Log the index and image

    var key = (ID + 1).toString();

    // Create a query to find the 'save' button related to the image
    var saveButtonQueryHome = "#homefeedGridFadeInTransitionContainer > div > div > div:nth-child(1) > div:nth-child("+key+") > div > div > div > div > div > div > div:nth-child(3) > div > div > div > div > div > button";
    var saveButtonQuerySearch = "#__PWS_ROOT__ > div > div:nth-child(1) > div > div.appContent > div > div > div:nth-child(5) > div > div:nth-child(1) > div > div > div > div:nth-child(1) > div:nth-child("+key+") > div > div > div > div > div > div > div:nth-child(3) > div > div > div > div > div > button";

    
    // Simulate a mouseover event on the image
    const image_to_save = image_list[ID];
    console.log(image_to_save.src);
    
    await sleep(2000);
    
    mouseOver(image_to_save);

    // Pause execution for 500 ms to allow the page to react to the mouseover event
    await sleep(2000);
    console.log("after mouseover");
    //console.log(window.location.href);
    if (window.location.href.startsWith("https://www.pinterest.fr/search/")){
        var save = document.querySelector(saveButtonQuerySearch); // Execute the query
        console.log("after save search");
    }
    else{
var save = document.querySelector(saveButtonQueryHome); // Execute the query
        console.log("got save");
    }
    await sleep(2000);
    console.log("after save");

        // If the 'save' button was found, click it
        if (save) {
            save.click();
            savedPic++; // Increase the counter for successfully clicked 'save' buttons
        } else {
            // If the 'save' button was not found, log an error message
            console.log(`[ERR] Element №${key} not saved`);
        }
        
        const randomNumber = getRandomNumber();
        //console.log(randomNumber);

        await sleep(2000);
        console.log("\n");
        
        // Log the total number of images that should be saved
        console.log("NUMBER OF IMAGE TO SAVE : " + goodImgId.length);
        
        // Log the total number of images that were actually saved
        console.log("NUMBER OF IMAGE SAVED : " + savedPic);
        console.log(goodImgId);
}

async function main() {

    // Assume you have a list of goodImgId
    // Replace with your actual good image IDs
    
    
    var pics = getListOfPics(images);
    var list_of_images = pics.imgList;
    var list_of_sources = pics.imgSource;
    var goodImgIds = await classifyImage(list_of_sources);
    
    console.log("Index of image to save : " + goodImgIds);
    
    keepPicsToSave(list_of_images, goodImgIds);
    
    await sleep(1000);
    
    // Call the function to start the process
    for (let i = 0; i < goodImgIds.length; i++) {
        processAutomation(list_of_images, goodImgIds[i]);
    }
}

main();
