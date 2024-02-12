
## image-loader-spinner
Use a spinner until your images are completely loaded in the DOM

### Installation
```bash
npm i image-loader-spinner
```

### Example output
![image](https://i.imgur.com/j6X4n5D.gif)

### Usage
```javascript
import ImageLoader from 'image-loader-spinner';

// first argument is an default image src error (default is null)
// second argument is the default size of loading container in pixel (default is 100)
ImageLoader('assets/images/errorLoad.png', 150);
```

```html
<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8">
        <title>My test page</title>
    </head>

    <body>
        <style>
            .spinner_container {
                display: flex;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            .spinner {
                border: 3px solid #333;
                border-bottom-color: transparent;
                border-radius: 50%;
                display: inline-block;
                box-sizing: border-box;
                animation: rotation 1s linear infinite;
                margin: auto
            }

            @keyframes rotation {
                0% {
                    transform: rotate(0deg);
                }

                100% {
                    transform: rotate(360deg);
                }
            }
        </style>

        <img src="assets/images/image.png" spinner="true" fadein="true"/> <!-- Show spinner container with defaultSize and fadeIn animation -->

        <img src="assets/images/image.png" spinner="true" size="150px" /> <!-- Show spinner container with widthSize 150px, heightSize 150px -->

        <div class="insideDiv">
            <img src="assets/images/image.png" spinner="true" wsize="50%" hsize="200px" /> <!-- Show spinner container with widthSize 50px, heightSize 200px -->
        </div>
    </body>
</html>
```

Add the attribute **spinner** to **true** for set the loading spinner instead an empty image.<br />
The attribute **size** is the size of your spinner_container (by default is set to 100 or your default value configuration).<br />
The attribute **wsize** is the width size of your spinner_container<br />
The attribute **hsize** is the height size of your spinner_container<br />
The attribute **fadein** will display your image with fadeIn animation to your opacity value (20fps)<br />
Values can be set to pixels, percentages, and viewports.<br /><br/>

The spinner will be half the size of your container.<br />
Your spinner will be display as :
```html
<div class="spinner_container">
    <div class="spinner"></div>
</div>
```
<br />
The module detect the DOM inserted images and updated images, and actualise spinners while loading.

### Test Delay
```javascript
import ImageLoader from 'image-loader-spinner';
ImageLoader();

const image = new Image();
image.setAttribute("spinner", "true");
image.setAttribute("hsize", "200")
image.setAttribute("wsize", "100%")
setTimeout(() => {
	image.src = "https://i.imgur.com/rsjPao4.gif";
}, 5000)
document.body.appendChild(image);
```

### Reload image src dynamically
```javascript
import ImageLoader from 'image-loader-spinner';
ImageLoader();

setTimeout(() => {
    const image = document.getElementById("myImage");
    image.setAttribute("spinner", "true");
    // image.setAttribute("size", "100"); // redefine size of the loader container
    image.src = "https://i.imgur.com/rsjPao4.gif";
}, 5000);
```