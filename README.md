
## image-loader-spinner
Use a spinner until your images are completely loaded in the DOM

### Installation
```bash
npm i image-loader-spinner
```

### Example output
![image](https://i.imgur.com/l9kSkEO.gif)

### Usage
```javascript
import ImageLoader from 'image-loader-spinner'
ImageLoader('assets/images/errorLoad.png'); // you can pass an default image src error
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

                .spinner {
                    border: 3px solid #333;
                    border-bottom-color: transparent;
                    border-radius: 50%;
                    display: inline-block;
                    box-sizing: border-box;
                    animation: rotation 1s linear infinite;
                    margin: auto
                }
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

        <img src="assets/images/image.png" spinner="100" /> <!-- Spinner size 50px -->

        <div class="insideDiv">
            <img src="assets/images/secondImage.png" spinner="150" /> <!-- Spinner size 150px -->
        </div>
    </body>
</html>
```

Add the attribute spinner for set the loading spinner instead an empty image.<br />
The attribute is the size of your spinner_container div.<br />
The spinner will be half the size of your container.<br />
The module detect the DOM inserted images and updated images, and actualise spinners while loading.

### Test Delay
```javascript
import ImageLoader from 'image-loader-spinner'
ImageLoader();

const image = new Image();
image.setAttribute("spinner", "100");
setTimeout(() => {
	image.src = "https://i.imgur.com/rsjPao4.gif";
}, 5000)
document.body.appendChild(image);
```

### Reload image src dynamically
```javascript
import ImageLoader from 'image-loader-spinner'
ImageLoader();

setTimeout(() => {
    const image = document.getElementById("myImage");
    image.setAttribute("spinner", "100");
	image.src = "https://i.imgur.com/rsjPao4.gif";
}, 5000)
```