.dark {
    --navbar-color: #6f40ff;
    --text-color: #ffffdb;
    --background-color: #212121;
    --background-color-2: #333333;
    --pink: #eaa8ff;
    --button-focus: #55576b;
    --post-color: #d7dadc;
    --subreddit-button: #ffcdff;
    --border-color: #646464;
    --border-color-2: #000000;
    --text-color-1: #eabfee;
    --link-color: #0074d9;
    --searchbar-unselected: #382963;
    --searchbar-selected: #38296399;
    --new-msg: #000000;
    --menu-selector-button: #21212130;
    --menu-selector-button-focus: #4b4d61;
    --setting-button-hover: #555555;
    --post-link-hover: #33333370;
    --menu-buttons-hover: #6b3fff;
}

.light {
    --navbar-color: #0001ff;
    --text-color: #323130;
    --background-color: #faf9f8;
    --background-color-2: #ffffff;
    --pink: #0001ff;
    --button-focus: #55576b;
    --post-color: #333333;
    --subreddit-button: #0001ff;
    --border-color: #646464;
    --border-color-2: #edebe9;
    --text-color-1: #605e5c;
    --link-color: #0074d9;
    --searchbar-unselected: #b3b3ff;
    --searchbar-selected: #b3b3ff99;
    --new-msg: #ffffff;
    --menu-selector-button: #f3f2f1;
    --menu-selector-button-focus: #e6e7ff;
    --setting-button-hover: #e1dfdd;
    --post-link-hover: #e6e7ff;
    --menu-buttons-hover: #0000d7;
}


body {
    color: var(--text-color);
    font-family: Calibri;
    background: var(--background-color);
    overflow-x: hidden; /* prevent side scrolling on main body*/
    overflow-y: hidden; /* hidden; prevent vertical scrolling on main body */
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    transition: background-color 0.6s ease;
}

button {
    outline: none;
}

.new-msg {
    color: var(--new-msg) !important;
}

.new-msg:hover {
    background-color: var(--pink);
}

.mark-as-read-btn:hover {
    background-color: var(--border-color-2);
    border-radius: 3px;
}

.post {
    position: relative; 
    background-color: var(--background-color-2);
    height: 84px;
    padding: 7px 15px 18px 50px;
    border: none;
    border-bottom: 1px solid var(--background-color);
    width: 100%;
    text-align: left;
    /* color: white; */
    color: var(--post-color);
}


.post:hover {
    background-color: var(--background-color);
    cursor: pointer;
}

.post:focus {
    border-left: 4px solid var(--pink);
    background-color: var(--post-link-hover);
}

.scrollable {
    /* position: absolute; */
    /* border: 2px solid black; */
    /* left: 246px; */
    /* top: 150px; */
    /* width: 25.3%; */
    height: 79vh;
    overflow-y: auto;
}


.title {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    font-weight: 700;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.post-data {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    display: block;
}

.subreddit {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    display: block;
    color: var(--subreddit-button);
}

.main-content {
    height: 86vh;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
}
.post-image {
    width: 70%;
    margin: auto;
    display: block;
    margin-bottom: 20px;
}
.post-video {
    width: 70%;
    margin: auto;
    display: block;
    margin-bottom: 20px;
}

@media (min-width: 700px) {
    .reddit-post {
        /* position: absolute; */
        background-color: var(--background-color);
        padding: 0px 12px;   
        border-left: 1px solid var(--border-color-2);
        color: var(--post-color);
        /* top: 13.5%; */
        /* left: 43.5%; */
        width: 50%;
        height: 86vh;
        /* flex: 1; */
        /* height: 100%; */
        /* width: 100%; */
        /* font-family: Verdana, Arial, helvetica, sans-serif; */
        margin: 0;
        padding: 20px;
        z-index: 1;
        flex-grow: 1;
        -webkit-user-select: text;  /* Chrome 49+ */
        -moz-user-select: text;     /* Firefox 43+ */
        -ms-user-select: text;      /* No support yet */
        user-select: text;          /* Likely future */   
    }
}

@media (max-width: 700px) {
    .reddit-post.scrollable.deselected, .reddit-post.scrollable {
        /*still need to work on styling for mobile*/
        position: absolute;
        display: none;
    }
    .post-sidebar {
        width: 100vw;
        /* margin-left: 48px; */
        height: 100vh !important;
    }
    .header-buttons {
        width: 100vw;
    }
    .scrollable {
        width: 100vw;
        height: 86vh;
    }
    .navbar {
        justify-content: space-around !important;
    }
    .search {
        border: none;
        border-radius: 3px;
        font-size: 16px;
        margin: 0 !important;
        /* margin: 5px 2.5vh; */
        transition: 0.16s ease-in;
    }
    .new-msg {
        padding: 0px;
        margin: 4px 0px;
    }
    .mark-as-read-btn, .dot-menu, .toolbar {
        display: none !important;
    }
    .header-buttons  {
        padding-left: 0 !important;
        max-height: 40px;
    }
    .post-header-button {
        margin-top: 5px !important;
    }
    header {
        padding: 0;
    }
}

@media (max-width: 520px) {
    .logo {
        display: none;
    }
    .search {
        margin-left: 5% !important;
    }
}

@media (max-width: 400px) {
    .menu-buttons {
        display: none !important;
    }
    .navbar {
        padding: 5px 5px !important;
    }
    .search {
        width: 95vw !important;
        margin: auto !important;
        padding: auto !important;
    }
}

@media (max-width: 1100px) {
    /* .menu-buttons>button {
        display: none;
    }
    .profile-pic, .settings-button {
        display: inline !important;
    } */
}

@media (max-width: 940px) {
    .navbar {
        /* justify-content: flex-start !important; */
        justify-content: space-around;
    }
    .menu-buttons>button {
        display: none;
    }
    .profile-pic, .settings-button {
        display: inline !important;
    }
    .search {
        margin-left: 10%;
    }
    .logo {
        position: static !important;
        margin-right: 10px;
        /* z-index: -1; */
    }
}

.post-title {
    font-size: 3em;
    font-weight: bold;
}

.post-author {
    font-size: 14px;
    color: var(--border-color);
}

.post-section-title {
    font-size: 20px;
    padding: 17px 0px 12px;
    display: block;
    font-weight: 600;
}


.post-link-container {
    display: flex;
    flex-direction: row;
    text-decoration: none;
    padding: 15px 15px;
    /* width: 98%; */
    background-color: var(--background-color-2);
    border-radius: 5px;
    border: 1px solid var(--border-color);
    transition: 0.16s ease;
    margin: 5px auto;
    color: var(--post-color);
    align-items: flex-start;
    margin-bottom: 20px;
}

.post-link-container>img {
    width: 75px;
    height: 75px;
    border-radius: 3px;
    margin-right: 15px;
}

.post-link-container>a {
    /* text-decoration: none; */
    font-size: 16px;
    font-weight: bold;
    transition: 0.16s ease;
    color: var(--link-color);
    text-decoration: none;
}

.post-link-container>a::after {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNDgiIGhlaWdodD0iNDgiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2Q3ZGFkYyI+PHBhdGggZD0iTTE0Ni43NzY2OSwxNy44NDY2OGMtMC4yNjQ3MSwwLjAwODcgLTAuNTI4NzMsMC4wMzIwNiAtMC43OTA4NiwwLjA2OTk5aC00NS42NTI1MWMtMi41ODQ1NiwtMC4wMzY1NSAtNC45ODg1OCwxLjMyMTM2IC02LjI5MTUzLDMuNTUzNzZjLTEuMzAyOTUsMi4yMzI0IC0xLjMwMjk1LDQuOTkzNDIgMCw3LjIyNTgyYzEuMzAyOTUsMi4yMzI0IDMuNzA2OTcsMy41OTAzMSA2LjI5MTUzLDMuNTUzNzZoMjkuMjgyNTVsLTQ4LjY4Mjk0LDQ4LjY4Mjk0Yy0xLjg3MjIzLDEuNzk3NTIgLTIuNjI2NDEsNC40NjY3NSAtMS45NzE2OCw2Ljk3ODI1YzAuNjU0NzIsMi41MTE1IDIuNjE2MDUsNC40NzI4MiA1LjEyNzU1LDUuMTI3NTVjMi41MTE1LDAuNjU0NzIgNS4xODA3MywtMC4wOTk0NiA2Ljk3ODI1LC0xLjk3MTY4bDQ4LjY4Mjk0LC00OC42ODI5NHYyOS4yODI1NWMtMC4wMzY1NSwyLjU4NDU2IDEuMzIxMzYsNC45ODg1OCAzLjU1Mzc2LDYuMjkxNTNjMi4yMzI0LDEuMzAyOTUgNC45OTM0MiwxLjMwMjk1IDcuMjI1ODIsMGMyLjIzMjQsLTEuMzAyOTUgMy41OTAzMSwtMy43MDY5NyAzLjU1Mzc2LC02LjI5MTUzdi00NS43MDE1YzAuMjc5ODcsLTIuMDg0IC0wLjM2OTUsLTQuMTg1NzggLTEuNzc2MTQsLTUuNzQ4NzFjLTEuNDA2NjQsLTEuNTYyOTMgLTMuNDI4NjQsLTIuNDI5MzQgLTUuNTMwNSwtMi4zNjk3OHpNNDQuNzkxNjcsMjguNjY2NjdjLTE0Ljc1MzcsMCAtMjYuODc1LDEyLjEyMTMgLTI2Ljg3NSwyNi44NzV2NzEuNjY2NjdjMCwxNC43NTM3IDEyLjEyMTMsMjYuODc1IDI2Ljg3NSwyNi44NzVoNzEuNjY2NjdjMTQuNzUzNywwIDI2Ljg3NSwtMTIuMTIxMyAyNi44NzUsLTI2Ljg3NXYtMzQuMDQxNjdjMC4wMzY1NSwtMi41ODQ1NiAtMS4zMjEzNiwtNC45ODg1OCAtMy41NTM3NiwtNi4yOTE1M2MtMi4yMzI0LC0xLjMwMjk1IC00Ljk5MzQyLC0xLjMwMjk1IC03LjIyNTgyLDBjLTIuMjMyNCwxLjMwMjk1IC0zLjU5MDMxLDMuNzA2OTcgLTMuNTUzNzYsNi4yOTE1M3YzNC4wNDE2N2MwLDYuOTc1NjMgLTUuNTY2MDMsMTIuNTQxNjcgLTEyLjU0MTY3LDEyLjU0MTY3aC03MS42NjY2N2MtNi45NzU2MywwIC0xMi41NDE2NywtNS41NjYwMyAtMTIuNTQxNjcsLTEyLjU0MTY3di03MS42NjY2N2MwLC02Ljk3NTYzIDUuNTY2MDMsLTEyLjU0MTY3IDEyLjU0MTY3LC0xMi41NDE2N2gzNC4wNDE2N2MyLjU4NDU2LDAuMDM2NTUgNC45ODg1OCwtMS4zMjEzNiA2LjI5MTUzLC0zLjU1Mzc2YzEuMzAyOTUsLTIuMjMyNCAxLjMwMjk1LC00Ljk5MzQyIDAsLTcuMjI1ODJjLTEuMzAyOTUsLTIuMjMyNCAtMy43MDY5NywtMy41OTAzMSAtNi4yOTE1MywtMy41NTM3NnoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==') 50% 50% no-repeat;
    background-size: 100%;
    content: "";
    margin-left: 5px;

}

/* .post-link-container>a:hover {
    text-decoration: none;
    color: white;
} */

.post-link-container>a{
    position: relative;
}
  
.post-link-container>a::before{
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 2px;
    color: var(--post-color);
    background-color: #0074D9;
    transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}
  
@media (hover: hover) and (pointer: fine) {
    .post-link-container>a:hover::before{
        left: 0;
        right: auto;
        width: 100%;
    }
}

.post-link-container:hover {
    background-color: var(--post-link-hover);
    cursor: pointer;
}

.post-detail-info {
    margin-top: 10px;
    padding: 10px 20px 0px 0px;
}

.replied-comment {
    /* text-indent: 1.3em; */
    margin-left: 1.5rem;
    border-left: 1px solid var(--border-color);
    padding-left: 10px;
}

button .menu {
    padding: 0;
    width: 32px !important;
    height: 32px !important;
}

.menu:active {
    background-color: var(--border-color-2);
}
.menu:hover {
    background-color: var(--border-color-2);
}

.navbar {
    background-color: var(--navbar-color);
    padding: 0;
    margin-right: auto !important;
    display: flex;
    flex-wrap: nowrap;
    /* justify-content: space-around !important; */
    justify-content: flex-start;
    flex-direction: row !important;
    align-items: center;
    /* width: 100vw !important; */
}


.menu-buttons {
    display: flex;
    /* justify-self: flex-start !important; */
    align-items: center;
    justify-content: flex-end;
    /* width: 100%; */
    flex: 1;
}

.logo {
    font-weight: bolder;
    font-size: 16px;
    padding: 0px 0px 0px 8px;
    color: white;
    /* position: absolute;
    top: 26%;
    left: 4%; */
    /* align-content: flex-start !important;
    flex-grow: 1; */
    /* margin: 0 auto 0 0 !important; */
    /* margin-right: 50px !important; */
    /* width: 10px !important; */
    font-family: SegoeUI-SemiBold-final,Segoe UI Semibold,SegoeUI-Regular-final,Segoe UI,"Segoe UI Web (West European)",Segoe,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,Tahoma,Helvetica,Arial,sans-serif;
    /* z-index: 3; */
}

.search {
    /* background-color: #; */
    /* background-color: #382963; */
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzIiIGhlaWdodD0iMzIiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2VhYmZlZSI+PHBhdGggZD0iTTEwMi4xMjUsMTYuMTI1Yy0yOS42MjU0OSwwIC01My43NSwyNC4xMjQ1MSAtNTMuNzUsNTMuNzVjMCwxMi44NzA2IDQuNTE0MTYsMjQuNjcwNDEgMTIuMDkzNzUsMzMuOTI5NjlsLTQyLjgzMjAzLDQyLjgzMjAzbDcuNzI2NTYsNy43MjY1Nmw0Mi44MzIwMywtNDIuODMyMDNjOS4yNTkyOCw3LjU3OTU5IDIxLjA1OTA4LDEyLjA5Mzc1IDMzLjkyOTY5LDEyLjA5Mzc1YzI5LjYyNTQ5LDAgNTMuNzUsLTI0LjEyNDUxIDUzLjc1LC01My43NWMwLC0yOS42MjU0OSAtMjQuMTI0NTEsLTUzLjc1IC01My43NSwtNTMuNzV6TTEwMi4xMjUsMjYuODc1YzIzLjgwOTU3LDAgNDMsMTkuMTkwNDMgNDMsNDNjMCwyMy44MDk1NyAtMTkuMTkwNDMsNDMgLTQzLDQzYy0yMy44MDk1NywwIC00MywtMTkuMTkwNDMgLTQzLC00M2MwLC0yMy44MDk1NyAxOS4xOTA0MywtNDMgNDMsLTQzeiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+');
    background-position: 16px 7px;
    background-size: 22px 22px;
    background-color: var(--searchbar-unselected);
    color: var(--text-color);
    background-repeat: no-repeat;
    border: none;
    border-radius: 3px;
    font-size: 16px;
    display: inline;
    max-width: 350px;
    width: 350px;
    padding: 5px 0 5px 50px;
    /* padding: 5px 150px 5px 48px; */
    margin-left: 180px;
    transition: 0.16s ease-in;
}

.search::placeholder {
    color: var(--pink)
}

.search:focus, input:focus{
    outline: none;
    background-color: var(--searchbar-selected);
    color: var(--text-color-1);
    /* color: white; */
    /* padding: 5px 140px 5px 48px; */
}

/* Style the button that is used to open and close the collapsible content */
.collapsible {
    cursor: pointer;
    font-weight: bold;
    text-align: left;
    outline: none;
    color: var(--text-color) !important;
    /* margin: 0 !important; */
    padding: 0 !important;
    font-weight: bold;
}

.collapsible>.ms-Icon {
    margin: 5px 20px 0 15px;
}

/* Style the collapsible content. Note: hidden by default */
.content {
    /* padding: 0 18px; */
    display: none;
    overflow: hidden;
}


nav span button {
    display: inline-block;
    background-color: var(--navbar-color);
    color: white;
    border: none;
    width: 48px;
    height: 48px;
}

nav span button:focus {
    outline: none;
}

header {
    background-color: var(--background-color);
    width: 100%;
    height: 45px;
    border-bottom: 1px solid var(--border-color-2);
    padding: 0px 0px 0px 48px;
    z-index: 1;
}

.new-msg {
    background-color: var(--subreddit-button);
    font-weight: 400;
    padding: 4px 17px;
    color: #212121;
    border: none;
    margin-right: 60px;
    border-radius: 2px;
    transition: background-color .156s ease;
    /* position: absolute;
    top: 55px;
    left: 95px; */
}

.hidden {
    display: none;
}

.post-sidebar {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border-color-2);
    border-bottom: 1px solid var(--border-color-2);
    /* width: 25.3%; */
    width: 350px;
    /* resize: horizontal; */
}

.post-sidebar:after {
    cursor: ew-resize;
}

.header-buttons {
    padding-left: 50px;
    height: 55px;
    background-color: var(--background-color-2);
    border-bottom: 1px solid var(--border-color-2);
}

.post-header-button {
    background-color: transparent;
    transition: 0.16s ease;
    color: white;
    padding: 5px 10px;
    margin-top: 20px;
    align-items: flex-end;
    border: none;
}

.post-header-button:focus {
    border-bottom: 3px solid  var(--pink);
    padding-bottom: 2px;
}
.post-header-button:hover {
    border-radius: 5px;
    background-color: var(--background-color);
}

header {
    display: flex;
    flex-direction: row;
    align-items: center;
}

header .menu {
    background-color: transparent;
    border: none;
    color: var(--subreddit-button);
    width: 42px;
    height: 30px;
    margin: 0 5px;
    align-items: center
}


.mark-as-read-btn {
    background: transparent;
    color:  var(--pink);
    border: none;
    padding: 5px 5px;
}

aside {
    /* position: fixed; */
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    /* z-index: 0; */
    min-width: 48px;
    height: 86vh;
    background-color: var(--border-color-2);
}

.toolbar button {
    color: var(--text-color);
    background: transparent;
    width: 48px;
    height: 48px;
    border: none;
    transition: 0.16s ease-in;
}

.toolbar button:hover {
    background-color: var(--background-color);
    margin: 10% 0;
}

.toolbar button:focus {
    border-left: 2px solid var(--pink);
}

.dot-menu {
    border: none;
    background-color: transparent;
    width: 48px;
    height: 48px;

}

.profile {
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 50%;
    color: white;
    font-weight: bold;
    text-align: center;
    font-size: 12px;
    position: absolute;
    top: 15px;
    left: 13px;
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
}

.deselected {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.get-started {
    margin-bottom: 5px;
}

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    border-radius: 5px;
    box-shadow: inset 0 0 10px var(--border-color-2);
    background-color: var(--background-color);
}

::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #c8c8c8;
}

@media (min-width: 920px) {
    .menu-selector {
        background-color: var(--background-color);
        width: 250px;
        height: 86vh;
        overflow-y: auto;
    }
}

@media (max-width: 920px) {
    .menu-selector {
        display: none;
    }
}

.menu-selector button {
    background-color: var(--menu-selector-button);
    color: var(--text-color);
    min-height: 40px;
    text-align: left;
    /* padding-left: 55px; */
    border: none;
}
.menu-selector button:hover {
    background-color: var(--border-color-2);
    border-radius: 3px; 
}

.menu-selector svg {
    margin: 0px 20px 0px 5px;
}

.menu-selector button:focus {
    background-color: var(--menu-selector-button-focus);
    color: var(--pink);
}

.favorites {
    /* padding: 15px 75px 15px 55px; */
    margin-top: 15px;
    margin-bottom: 5px;
    font-weight: bold;
}


.favorites>.ms-Icon {
    margin: 5px 20px 0 15px !important;
}

.menu-selector button:focus {
    outline: none;
}

.subreddits-section p {
    margin: 20px 75px 15px 55px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
}
.subreddits-section {
    padding: 0;
    margin: 0;
    font-weight: 400;
    display: flex;
    flex-direction: column;
}

.subreddits-section button {
    width: 100%;
    padding-left: 55px;
    background-color: var(--menu-selector-button);
    color: var(--pink);
    height: 40px;
    text-align: left;
    /* padding-left: 55px; */
    border: none;
}

.subreddits-section button:hover {
    background-color: var(--border-color-2);
}

.subreddits-section button:focus {
    background-color: var(--menu-selector-button-focus);
    color: var(--pink);
}

.meet-now {
    width: 120px;
}

.menu-buttons button:hover {
    background-color: var(--menu-buttons-hover);
}

#preloadDiv {
    height: 1px;
    margin-bottom: -1px;
    overflow: hidden;
    visibility: hidden;
}

#loadingScreen {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--background-color-2);
    z-index: 100;
}

#loadingLogo {
    position: fixed;
    top: calc(50vh - 90px);
    left: calc(50vw - 90px);
    width: 180px;
    height: 180px;
}

#MSLogo {
    position: fixed;
    bottom: 36px;
    left: calc(50vw - 45px);
}

.dark #loadingScreen {
    background-color: var(--background-color-2);
}


#loadingLogo2_ts {
    animation: loadingLogo2_ts__ts 3000ms linear 1 normal forwards;
    animation-iteration-count: 1000;
}

#loadingLogo2 {
    animation: loadingLogo2_c_o 3000ms linear 1 normal forwards;
    animation-iteration-count: 1000;
}

#loadingLogo3_to {
    animation: loadingLogo3_to__to 3000ms linear 1 normal forwards;
    animation-iteration-count: 1000;
}

#loadingLogo6_ts {
    animation: loadingLogo6_ts__ts 3000ms linear 1 normal forwards;
    animation-iteration-count: 1000;
}

#loadingLogo8_ts {
    animation: loadingLogo8_ts__ts 3000ms linear 1 normal forwards;
    animation-iteration-count: 1000;
}

#loadingLogo9_to {
    animation: loadingLogo9_to__to 3000ms linear 1 normal forwards;
    animation-iteration-count: 1000;
}

#loadingLogo29_ts {
    animation: loadingLogo29_ts__ts 3000ms linear 1 normal forwards;
    animation-iteration-count: 1000;
}

@keyframes loadingLogo2_ts__ts {
    0% {
        transform: translate(108.894430px,155.715127px) scale(0.668963,0.668963);
        animation-timing-function: cubic-bezier(0.420000,0,0.580000,1)
    }
    26.666667% {
        transform: translate(108.894430px,155.715127px) scale(1,1)
    }
    100% {
        transform: translate(108.894430px,155.715127px) scale(1,1)
        }
    }


@keyframes loadingLogo2_c_o {
    0% {
        opacity: 0
        }
    18.333333% {
        opacity: 1
    }
    100% {
        opacity: 1
    }
}

@keyframes loadingLogo3_to__to {
    0% {
        transform: translate(101.000155px,195.970703px)
    }
    13.333333% {
        transform: translate(101.000155px,195.970703px);
        animation-timing-function: cubic-bezier(0,0,1,0.025000)
    }
    31% {
        transform: translate(101.000155px,206px);
        animation-timing-function: cubic-bezier(0.135000,0.710000,0.030000,0.985000)
    }
    50% {
        transform: translate(101.000155px,195.970703px)
    }
    100% {
        transform: translate(101.000155px,195.970703px)
        }
    }

@keyframes loadingLogo6_ts__ts {
    0% {
        transform: translate(101.000708px,97.499588px) scale(1,-0.001720)
    }
    23.333333% {
        transform: translate(101.000708px,97.499588px) scale(1,-0.001720);
        animation-timing-function: cubic-bezier(0.135000,0.710000,0.030000,0.985000)
    }
    40% {
        transform: translate(101.000708px,97.499588px) scale(1,1)
        }
    100% {
        transform: translate(101.000708px,97.499588px) scale(1,1)
        }
    }

@keyframes loadingLogo8_ts__ts {
    0% {
        transform: translate(101.000699px,159.914723px) scale(1,1)
    }
    39.666667% {
        transform: translate(101.000699px,159.914723px) scale(1,1)
    }
    50% {
        transform: translate(101.000699px,159.914723px) scale(1,1.050360)
    }
    52.333333% {
        transform: translate(101.000699px,159.914723px) scale(1,0.959233)
    }
    57.666667% {
        transform: translate(101.000699px,159.914723px) scale(1,1)
    }
    100% {
        transform: translate(101.000699px,159.914723px) scale(1,1)
    }
}

@keyframes loadingLogo9_to__to {
    0% {
        transform: translate(101px,205.753765px)
    }
    26.666667% {
        transform: translate(101px,205.753765px);
        animation-timing-function: cubic-bezier(0.175000,0.885000,0.320000,1.275000)
    }
    50% {
        transform: translate(101px,81px)
    }
    100% {
        transform: translate(101px,81px)
    }
}

@keyframes loadingLogo29_ts__ts {
    0% {
        transform: translate(101.000699px,97.499573px) scale(1,1)
    }
    13.333333% {
        transform: translate(101.000699px,97.499573px) scale(1,1);
        animation-timing-function: cubic-bezier(0,0,1,0.025000)
    }
    23.333333% {
        transform: translate(101.000699px,97.499573px) scale(1,0.001723)
    }
    100% {
        transform: translate(101.000699px,97.499573px) scale(1,0.001723)
    }
}

.settings-button {
    transition: 0.2s ease;
}

.settings-button:focus {
    background-color: #3c3c3c;
}

.settings-panel {
    position: absolute;
    left: 100%;
    top: 49px;
    z-index: 100;
    min-width: 150px;
    width: 250px;
    height: 95vh;
    padding-top: 20px;
    padding-left: 10px;
    background-color: var(--background-color);
    border-left: 1px solid #999999;
    font: 600 20px SegoeUI-SemiBold-final,Segoe UI Semibold,SegoeUI-Regular-final,Segoe UI,"Segoe UI Web (West European)",Segoe,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,Tahoma,Helvetica,Arial,sans-serif;
    transition: left 0.16s ease-in;
    /* display: none; */
}

.settings-panel-show {
    left: calc(100% - 250px);
    /* display: inline; */
}

.form-switch>label {
    font-size: 16px !important;
}

.settings-header {
    display: flex;
    flex-direction: row;
    width: 200px;
}

.close-settings {
    /* margin-left: 80%; */
    /* border: none; */
    background-color: transparent;
    height: 40px;
    width: 40px;
    position: absolute;
    min-width: 0;
    top: 12px;
    left: calc(100% - 44px);
    padding: 5px;
    border-width: 0;
    cursor: pointer;
    border-radius: 3px;
    color: white;
}


.close-settings:hover {
    background-color: var(--setting-button-hover);
}
