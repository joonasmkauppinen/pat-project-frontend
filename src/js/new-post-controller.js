'use strict';

/* ------------------------+-------------------------------+
|   .----.  .--.  .---.    |  CREATED BY TEAM JJS          |
|   | {}  }/ {} \{_   _}   +-------------------------------+
|   | .--'/  /\  \ | |     |  Joonas Kauppinen             |
|   `-'   `-'  `-' `-'     |  "Jamie" GeonHui Yoon         |
|   - a place for pets -   |  Samuli Virtanen              |
+--------------------------+-------------------------------+
| https://github.com/joonasmkauppinen/pat-project-backend  |
| https://github.com/joonasmkauppinen/pat-project-frontend |
+-------------------------------------------------------- */



const regex = /^[a-zA-Z0-9-_., ]$/;

let topTagsArr      = [];
let currentTagsArr  = [];
const tagDelimiters = [' ', ',', '.'];

const newPostForm = document.getElementById('new-post-form');

const tagsParent     = document.querySelector('new-post-form__tags-input');

const fileInput      = document.getElementById('media');
const mediaElement   = document.querySelector('.new-post-form__add-media');
const description    = document.getElementById('new-post-description');

const tagsAmount		 = document.getElementById('current-tags-amount');
const currentTags    = document.getElementById('current-tags');
const tagsInput      = document.getElementById('new-post-tags');
const topTagsSection = document.querySelector('.new-post-form__tags-input__top-tags');
const topTagsList    = document.getElementById('top-tags');

const submitNewPost  = document.getElementById('submit-new-post');

let topTagsExpanded = false;

const updateCurrentTagsAmount = () => {
	tagsAmount.innerHTML = currentTagsArr.length;
}

const newTag = (value, topTag = false) => {
	const li = document.createElement('li');
	li.classList.add('new-post-tag', 'clickable');
	li.innerHTML = value;
	if (topTag) {
		li.addEventListener('click', () => {
			tagsInput.focus();
			if (currentTagsArr.length === 8) return;
			addNewCurrentTag(li.innerHTML);
		});
	} else {
		li.addEventListener('click', (e) => {
			tagsInput.focus();
			const tagIndex = currentTagsArr.indexOf(e.target.innerHTML);
			removeCurrentTag(tagIndex);
		});
	}
	return li;
}

const addNewCurrentTag = (tag = null) => {
	let tagVal = tag;
	
	if (tagVal === null) {
		const inputVal = tagsInput.value;
		if (inputVal === " " || inputVal === "," || inputVal === ".") { 
			return; 
		}
		
		tagVal = inputVal.substring(0, inputVal.length-1);
	}
	
	if (isCurrentTag(tagVal)) return;
	
	currentTagsArr.push(tagVal);
	updateCurrentTagsAmount();
	const inputElement = currentTags.children[currentTags.childElementCount-1];
	currentTags.insertBefore(newTag(tagVal), inputElement);
	toggleTopTag(tagVal);
}

const removeCurrentTag = (index = currentTagsArr.length-1) => {
	currentTags.removeChild(currentTags.children[index]);
	toggleTopTag( currentTagsArr[index] );
	currentTagsArr.splice(index, 1);
	updateCurrentTagsAmount();
}


const toggleTopTag = (tagValue) => {
	const i = topTagsArr.indexOf(tagValue);
	if (i !== -1) {
		topTagsList.children[i].classList.toggle('new-post-tag-hidden');
	}
}

const isCurrentTag = (tag) => {
	const index = currentTagsArr.indexOf(tag);
	if (index === -1) {
		return false;
	} else {
		return true;
	}
}

const getTagsAsString = () => {	
	if ( currentTagsArr.length > 0 ) {
		return currentTagsArr.join(' ');
	} else {
		return '';
	}
};


fileInput.addEventListener('change', () => {
	
	if (fileInput.files && fileInput.files[0]) {
		
		if (mediaElement.children[1] !== undefined) {
			mediaElement.removeChild(mediaElement.children[1]);
		} else {
			mediaElement.children[0].classList.toggle('hidden');
		}
		
		console.log("Media file type: ", fileInput.files[0].type);
		
		submitNewPost.disabled = false;
		
		//mediaElement.removeChild(mediaElement.children[0]);
		
		const reader = new FileReader();
		
		let selectedMedia = null;
		
		switch (fileInput.files[0].type) {
			case "image/jpeg":
			selectedMedia = document.createElement('img');
			
			reader.onload = (file) => selectedMedia.setAttribute('src', file.target.result);
			reader.readAsDataURL(fileInput.files[0]);
			break;
			
			case "video/mp4":
			selectedMedia = document.createElement('video');
			selectedMedia.autoplay = true;
			selectedMedia.muted = true;
			selectedMedia.loop = true;
			
			reader.onload = (file) => selectedMedia.setAttribute('src', file.target.result);
			reader.readAsDataURL(fileInput.files[0]);
			break;
			
			default:
			return;
			break;
		}
		
		mediaElement.appendChild(selectedMedia);
		mediaElement.style.height = '100%';
		mediaElement.children[1].classList.add('media-preview');
		
	} else {
		
		submitNewPost.disabled = true;
		
		mediaElement.removeChild(mediaElement.children[1]);
		mediaElement.children[0].classList.toggle('hidden');
		mediaElement.style.height = "100vw";
		
	}
	
});

tagsInput.addEventListener('focus', () => {
	if (topTagsExpanded === false) {
		topTagsSection.classList.toggle('top-tags-hidden');
		topTagsExpanded = true;
	}
});

tagsInput.addEventListener('blur', () => {
	if (topTagsExpanded === true) {
		topTagsSection.classList.toggle('top-tags-hidden');
		topTagsExpanded = false;
	}
});

tagsInput.addEventListener('input', (e) => {
	
	if (currentTagsArr.length === 8) {
		tagsInput.value = "";
		return;
	}
	
	tagsInput.style.width = "70px";
	tagsInput.style.width = (tagsInput.scrollWidth)+"px";
	
	if (tagsInput.value.length > 16 || ( !regex.test(e.data) && e.inputType !== "deleteContentBackward")) {
		const currentInput = tagsInput.value;
		const limitedInput = currentInput.substring(0, currentInput.length-1);
		tagsInput.value = limitedInput;
		return;
	}
	
	if (regex.test(e.data) || e.inputType === "deleteContentBackward") {
		
		tagDelimiters.forEach(delimChar => {
			if (e.data === delimChar) {
				if (tagsInput.value.length >= 3) {
					addNewCurrentTag();
				}
				tagsInput.value = "";
			}
		});
		
	} else {
		tagsInput.value = "";
	}
});

let doubleTapToRemove = 0;
tagsInput.addEventListener('keyup', (e) => {
	
	// Check is backspace pressed and input is empty
	if (e.keyCode === 8 && tagsInput.value === "" && currentTagsArr.length > 0) {
		doubleTapToRemove++;
		if (doubleTapToRemove === 2) {
			removeCurrentTag();
			doubleTapToRemove = 0;
		}
	} else if (e.keyCode === 13) { // Check if enter is pressed and add space to input value to process it correctly
		tagsInput.value += " ";
		addNewCurrentTag();
		tagsInput.value = "";
	}
	
});

topTagsList.addEventListener('click', () => {
	tagsInput.focus();
});

currentTags.addEventListener('click', () => {
	tagsInput.focus();
})

description.addEventListener('input', () => {
	description.style.height = "10px";
	description.style.height = (description.scrollHeight)+"px";
});

newPostForm.addEventListener('submit', (e) => {
	
	e.preventDefault();
	
	const data = new FormData();
	data.append ( 'upload_file', fileInput.files[0] );
	data.append ( 'tags', getTagsAsString() );
	data.append ( 'description', description.value );
	data.append ( 'session_id', sessionID );
	data.append ( 'session_token', sessionToken );
	
	const options = { method: 'POST', "Content-Type": "application/x-www-form-urlencoded", body: data };
	
	fetch(API_URL + 'posts/upload', options).then( res => {
		return res.json();
	}).then((json) => {
		console.log(json);
	});
	
	
});

setTimeout(() => {
	getJSON('POST', 'tags').then( res => {
		if (res.success) {
			topTagsArr = res.tags;
			topTagsArr.forEach(element => {
				topTagsList.appendChild(newTag(element, true));
			});
		}
	})
	.catch( err => {
		console.log('[getJSON] error: ', err);
	});	
}, 100);

updateCurrentTagsAmount();