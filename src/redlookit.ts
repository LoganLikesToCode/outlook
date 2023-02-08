import "../styles/redlookit.css"
import "./@types/reddit-types.ts"
import {HumanFacesSideLoader} from "./faces_sideloader"
import {Random, UUID, UUIDFormat} from "./random";
import {subreddits} from "./subredditList";


declare var axios: any

function isDebugMode(): boolean {
    // Won't support ipv6 loopback
    const url = new URL(document.URL);
    return url.protocol === "file:" || url.host === "localhost" || url.host === "127.0.0.1";
}

function assert(condition: boolean, msg: string = "Assertion failed"): asserts condition {
    if (!condition && isDebugMode()) {
        throw new Error(msg);
    }
}

// A query selector that throws
function strictQuerySelector<T extends Element>(selector: string): T {
    const element: T | null = document.querySelector<T>(selector);
    assert(element !== null, `Failed to find a DOM element matching selector "${selector}"`);
    return element;
}

const redditBaseURL: string = "https://www.reddit.com";
const postsList: HTMLElement = strictQuerySelector("#posts");
const postSection: HTMLElement = strictQuerySelector('section.reddit-post');
let colors = ['#c24332', '#2e303f', '#63948c', '#ebe6d1', '#517c63', '#4c525f', '#371d31', '#f95950', '#023246', '#2e77ae', '#0d2137', '#ff8e2b'];
let initials = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

const menuButton: HTMLElement = strictQuerySelector('.menu');
const sideNavBar: HTMLElement = strictQuerySelector('.menu-selector')
menuButton!.addEventListener('click', () => {
    sideNavBar!.classList.toggle('hidden')
})

const facesSideLoader = new HumanFacesSideLoader(200); // Side-load 200 faces in the background

const rng = new Random();

type Permalink = string;
function showRedditLink(permalink: Permalink): boolean {
    const postMatch = permalink.match(/\/?r\/([^/]+?)\/comments\/([^/]+)/);
    if (isDebugMode()) console.log("postMatch", postMatch);

    if (postMatch !== null) {
        // The anchor points to a post
        showSubreddit(postMatch[1]);
        clearPost();
        showPost(permalink).catch( (reason) => {
            console.error("There was a problem drawing this post on the page", {
                "reason": reason,
                "permalink": permalink,
                "match results": postMatch
            });
        });
        return true;
    } else {
        const subMatch = permalink.match(/\/?r\/([^/]+)/);
        if (isDebugMode()) console.log("subMatch", subMatch);

        if (subMatch !== null) {
            // The anchor points to a sub
            showSubreddit(subMatch[1]);
            return true;
        } else {
            // The anchor points to something weird
            return false;
        }
    }
}

function showRedditPageOrDefault(permalink: Permalink | null) {
    if (isDebugMode()) console.log("interpreting link", permalink);
    if (permalink === null) {
        // We don't have an anchor in the URL
        showSubreddit("popular");
        if (isDebugMode()) {
            showPost(`/r/test/comments/z0yiof/formatting_test/`).catch((reason) => {
                console.error("There was a problem drawing the test post on the page", {
                    "reason": reason,
                });
            });
        }
    } else {
        // We have an anchor in the URL
        const itWorked = showRedditLink(permalink);
        if (!itWorked) {
            // The anchor pointed to something we do not support
            showSubreddit("popular");
        }
    }

}

function showSubreddit(subreddit: string) {
    clearPostsList();
    let section = document.createElement('section');
    section.classList.add('post')
    document.querySelector('.post-header-button.sort').id = subreddit;

    axios.get(`${redditBaseURL}/r/${subreddit}.json?limit=75`)
        .then(function (response1) {
            const responseData = response1.data.data.children;
            axios.get(`${redditBaseURL}/r/${subreddit}/about.json`)
                .then(function(response2) {
                    const subredditInformation = response2.data;
                    displayPosts(responseData, subreddit, subredditInformation);
                })
                .catch((e: Error) => {
                    displayPosts(responseData, subreddit);
                    console.error(e);
                })
        })
        .catch((e: Error) => {
            console.error(e);
        })
}

function showPost(permalink: Permalink) {
    const baseurl = removeTrailingSlash(new URL(`${redditBaseURL}${permalink}`));
    const url = `${baseurl}/.json?limit=75`;
    return axios.get(url).then((response) => {
        try {
            clearPostSection();
            showPostFromData(response);
        } catch (e) {
            console.error(e)
        }
    }).catch((e) => {
        console.error(e)
    });
}

function permalinkFromURLAnchor(): Permalink | null {
    // Capture the '/r/sub/...' part including the /r/
    const permalink = new URL(document.URL).hash
    if (permalink === "") {
        return null;
    }

    // Remove the starting #
    return permalink.slice(1);
}

function removeTrailingSlash(url: URL): URL {
    if (url.pathname.slice(-1) === '/') {
        url.pathname = url.pathname.slice(0,-1);
        return url;
    } else {
        return url;
    }
}

interface URLAnchorFlags {
    pushState: boolean
}
function setURLAnchor(permalink: Permalink, flags: URLAnchorFlags = {pushState:true}): void {
    const url = removeTrailingSlash(new URL(document.URL));
    const newurl = new URL(`${url.protocol}//${url.hostname}${url.pathname}#${permalink}`);
    if (flags.pushState) {
        window.history.pushState({}, '', newurl);
    }
}

function getSubredditIcon(subredditInformation) {
    if (subredditInformation.data.icon_img != '') {
        return subredditInformation.data.icon_img
    } else if (subredditInformation.data.community_icon != '') {
        return subredditInformation.data.community_icon.replaceAll("&amp;", "&");
    } else {
        return 'https://img.icons8.com/fluency-systems-regular/512/reddit.png';
    }
}

// localStorage.setItem('showSubDetails', 'true');
let subredditInfoContainer = document.createElement('div');
let subredditInfoHeading = document.createElement('div');
let subredditInfoDetails = document.createElement('div');
let subredditInfoIcon = document.createElement('img');
let subredditIconContainer = document.createElement('div');
let subredditDetailsContainer = document.createElement('div');
let headerButtons = document.querySelector('.header-buttons') as HTMLElement;
let scrollable = document.querySelector('#posts.scrollable') as HTMLElement;
let favoriteIcon = document.createElement('span');

function displayPosts(responses, subreddit, subredditInformation={"data": {"title": null, "icon_img": '', "community_icon": '', "subscribers": null, "public_description": null, "active_user_count": 0, "display_name_prefixed": null, "over18": false}}) {
    if (subreddit !== 'popular' && (localStorage.getItem('showSubDetails') == 'true' || localStorage.getItem('showSubDetails') == null)) {
        // let postSectionDiv = document.querySelector('.post-sidebar');
        subredditInfoContainer.style.display = 'flex';
        headerButtons.style.borderRadius = "0";
        subredditInfoContainer.classList.add('subreddit-info');
        subredditInfoHeading.innerHTML = subredditInformation.data.title;
        subredditInfoHeading.classList.add('subreddit-info-heading');
        favoriteIcon.id = subreddit;
        if (localStorage.getItem('savedSubreddits')) {
            if (localStorage.getItem('savedSubreddits').toLowerCase().includes(subreddit.toLowerCase())) {
                // console.log(`r/${subreddit} in SAVED DATA: ${localStorage.getItem('savedSubreddits')}`)
                favoriteIcon.innerHTML = '<svg width="16" height="16" class="favorite-icon favorited" viewBox="0 0 176 168" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M89.7935 6.93173L111.277 50.4619C113.025 54.0036 116.404 56.4584 120.312 57.0264L168.351 64.0068C169.991 64.2451 170.646 66.2611 169.459 67.4182L134.698 101.302C131.87 104.058 130.579 108.031 131.247 111.923L139.453 159.767C139.733 161.401 138.018 162.647 136.551 161.876L93.5841 139.287C90.0882 137.449 85.9118 137.449 82.4159 139.287L39.4491 161.876C37.9818 162.647 36.267 161.401 36.5472 159.768L44.7531 111.923C45.4208 108.031 44.1302 104.059 41.302 101.302L6.54106 67.4182C5.35402 66.2611 6.00905 64.2451 7.64948 64.0068L55.6879 57.0264C59.5964 56.4584 62.9752 54.0036 64.7231 50.4619L86.2065 6.93174C86.9402 5.44523 89.0599 5.44525 89.7935 6.93173Z"/></svg>'
            } else {
                favoriteIcon.innerHTML = '<svg width="16" height="16" class="favorite-icon" viewBox="0 0 176 168" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M89.7935 6.93173L111.277 50.4619C113.025 54.0036 116.404 56.4584 120.312 57.0264L168.351 64.0068C169.991 64.2451 170.646 66.2611 169.459 67.4182L134.698 101.302C131.87 104.058 130.579 108.031 131.247 111.923L139.453 159.767C139.733 161.401 138.018 162.647 136.551 161.876L93.5841 139.287C90.0882 137.449 85.9118 137.449 82.4159 139.287L39.4491 161.876C37.9818 162.647 36.267 161.401 36.5472 159.768L44.7531 111.923C45.4208 108.031 44.1302 104.059 41.302 101.302L6.54106 67.4182C5.35402 66.2611 6.00905 64.2451 7.64948 64.0068L55.6879 57.0264C59.5964 56.4584 62.9752 54.0036 64.7231 50.4619L86.2065 6.93174C86.9402 5.44523 89.0599 5.44525 89.7935 6.93173Z"/></svg>'
            }
        } else {
            favoriteIcon.innerHTML = '<svg width="16" height="16" class="favorite-icon" viewBox="0 0 176 168" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M89.7935 6.93173L111.277 50.4619C113.025 54.0036 116.404 56.4584 120.312 57.0264L168.351 64.0068C169.991 64.2451 170.646 66.2611 169.459 67.4182L134.698 101.302C131.87 104.058 130.579 108.031 131.247 111.923L139.453 159.767C139.733 161.401 138.018 162.647 136.551 161.876L93.5841 139.287C90.0882 137.449 85.9118 137.449 82.4159 139.287L39.4491 161.876C37.9818 162.647 36.267 161.401 36.5472 159.768L44.7531 111.923C45.4208 108.031 44.1302 104.059 41.302 101.302L6.54106 67.4182C5.35402 66.2611 6.00905 64.2451 7.64948 64.0068L55.6879 57.0264C59.5964 56.4584 62.9752 54.0036 64.7231 50.4619L86.2065 6.93174C86.9402 5.44523 89.0599 5.44525 89.7935 6.93173Z"/></svg>'
        }

        subredditInfoContainer.title = `${subredditInformation.data.display_name_prefixed} • ${numberFormatter(subredditInformation.data.subscribers)} members • ${subredditInformation.data.active_user_count} online ${subredditInformation.data.public_description}`;
        subredditInfoDetails.innerHTML = `${subredditInformation.data.display_name_prefixed} • ${numberFormatter(subredditInformation.data.subscribers)} members • ${subredditInformation.data.active_user_count} online`;
        if (subredditInformation.data.over18) {
            subredditInfoDetails.innerHTML += '<br><span color="red">Warning: NSFW!</span>'
        }
        subredditInfoDetails.classList.add('subreddit-info-details');
        subredditInfoIcon.src = getSubredditIcon(subredditInformation);
        subredditInfoIcon.classList.add('subreddit-info-icon');
        if (subreddit == 'gnometalk') {
            subredditInfoHeading.innerHTML = 'You found an easter egg!';
            subredditInfoIcon.src = 'https://static.wikia.nocookie.net/surrealmemes/images/f/ff/Noggin.png/revision/latest?cb=20190114192842';
        }
        subredditDetailsContainer.append(subredditInfoHeading, subredditInfoDetails);
        subredditIconContainer.append(subredditInfoIcon);
        subredditIconContainer.classList.add('subreddit-icon-container');
        subredditDetailsContainer.classList.add('subreddit-details-container');
        subredditInfoContainer.append(subredditIconContainer, subredditDetailsContainer, favoriteIcon);
        headerButtons.parentNode.insertBefore(subredditInfoContainer, headerButtons);
        // scrollable.style.height = `calc(100vh - ${calcHeight})`;
        scrollable.style.height = 'calc(100vh - 273px)';
    } else {
        subredditInfoContainer.style.display = 'none';
        headerButtons.style.borderRadius = "4px 4px 0px 0px";
        scrollable.style.height = 'calc(100vh - 178px)';
    }
    if (subreddit.toLowerCase() == 'crappydesign') {document.body.style.fontFamily = '"Comic Sans MS", "Comic Sans", cursive'; subredditInfoContainer.style.background = `linear-gradient(${Math.floor(Math.random() * (360 - 0 + 1) + 0)}deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)`; subredditInfoContainer.style.backgroundSize = '350px'; subredditInfoContainer.style.transform = `rotate(${Math.floor(Math.random() * (5 - -5 + 1) + -5)}deg)`; subredditInfoContainer.style.zIndex = '10'} else { document.body.style.fontFamily = 'Segoe UI'; subredditInfoContainer.style.background = 'var(--background-color-2)', subredditInfoContainer.style.transform = 'none', subredditInfoContainer.style.zIndex = 'auto'}
    for (let response of responses) {
        let section: HTMLButtonElement = document.createElement('button');
        section.classList.add('post');

        let title = document.createElement('span');
        let titleText = response.data.title;
        title.append(titleText);
        section.title = response.data.title;
        title.classList.add('title');

        let subreddit = document.createElement('span');
        subreddit.append(response.data.subreddit_name_prefixed);
        subreddit.classList.add('subreddit');
        let upvotes = document.createElement('span');

        upvotes.innerHTML = '<svg width="15" height="15" style="margin-right: 5px;" viewBox="0 0 94 97" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M88.1395 48.8394C84.9395 46.0394 60.4728 18.0061 48.6395 4.33939C46.6395 3.53939 45.1395 4.33939 44.6395 4.83939L4.63948 49.3394C2.1394 53.3394 7.63948 52.8394 9.63948 52.8394H29.1395V88.8394C29.1395 92.0394 32.1395 93.1727 33.6395 93.3394H58.1395C63.3395 93.3394 64.3062 90.3394 64.1395 88.8394V52.3394H87.1395C88.8061 52.0061 91.3395 51.6394 88.1395 48.8394Z" stroke="#818384" stroke-width="7"/></svg>'
        upvotes.append(`${response.data.score.toLocaleString()}`);
        upvotes.innerHTML += '<svg width="15" height="15" style="transform: rotate(180deg); margin-left: 5px" viewBox="0 0 94 97" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M88.1395 48.8394C84.9395 46.0394 60.4728 18.0061 48.6395 4.33939C46.6395 3.53939 45.1395 4.33939 44.6395 4.83939L4.63948 49.3394C2.1394 53.3394 7.63948 52.8394 9.63948 52.8394H29.1395V88.8394C29.1395 92.0394 32.1395 93.1727 33.6395 93.3394H58.1395C63.3395 93.3394 64.3062 90.3394 64.1395 88.8394V52.3394H87.1395C88.8061 52.0061 91.3395 51.6394 88.1395 48.8394Z" stroke="#818384" stroke-width="7"/></svg>'
        upvotes.classList.add('post-data');
        let profile = document.createElement('span');
        profile.classList.add('profile');
        let ppInitials = initials[Math.floor(Math.random() * initials.length)] + initials[Math.floor(Math.random() * initials.length)];
        let ppColor = colors[Math.floor(Math.random() * colors.length)];
        if (ppColor === '#ebe6d1' || ppColor === '#ebe6d1') {
            profile.style.color = 'black';
        }
        profile.style.backgroundColor = ppColor;
        profile.append(ppInitials);
        section.append(profile, title, subreddit, upvotes);
        if (response.data.subreddit_name_prefixed.toLowerCase() == 'r/crappydesign') {
            section.style.transform = `rotate(${Math.floor(Math.random() * (5 - -5 + 1) + -5)}deg)`
            section.style.zIndex =  `${Math.floor(Math.random() * (10 - 1 + 1) + 1)}`
            profile.style.background = `linear-gradient(${Math.floor(Math.random() * (360 - 0 + 1) + 0)}deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)`;

        }
        // section.id = response.data.url;

        section.addEventListener('click', () => {
            document.querySelector(".focused-post")?.classList.remove("focused-post");
            section.classList.add("focused-post");
            setURLAnchor(response.data.permalink);
            showPost(response.data.permalink).catch( (reason) => {
                console.error("There was a problem drawing this post on the page", {
                    "reason": reason,
                    "permalink": response.data.permalink,
                });
            });
        })
        postsList.append(section);
    }
    postsList.append("That's enough reddit for now. Get back to work!")
}

favoriteIcon.addEventListener('click', function() {
    let favoriteIconClasses = document.querySelector('.favorite-icon').classList
    let favorited = favoriteIconClasses.contains('favorited');
    if (!favorited) {
        favoriteIconClasses.add('favorited');
        // console.log(`favoriting ${favoriteIcon.id}`)
        favoriteSubreddit(favoriteIcon.id);
    } else {
        favoriteIconClasses.remove('favorited');
        // console.log(`unfavoriting ${favoriteIcon.id}`)
        unFavoriteSubreddit(favoriteIcon.id);
    }
})

function favoriteSubreddit(subreddit) {
    // console.log(`Favoriting r/${subreddit}`);
    let subredditBtn: HTMLButtonElement = document.createElement<"button">('button');
    subredditBtn.classList.add('subreddit', 'button');
    subredditBtn.id = subreddit;
    subredditBtn.addEventListener('click', async () => {
        clearPost();
        if (isDebugMode()) console.log("custom sub click", subredditBtn.id);
        setURLAnchor(`/r/${subredditBtn.id}`);
        showSubreddit(subredditBtn.id);
    })
    // document.cookie.subreddits.append(subreddit.value);
    if (localStorage.getItem('savedSubreddits')) {
        let savedSubreddits = localStorage.getItem('savedSubreddits');
        savedSubreddits += `,${subreddit}`;
        localStorage.setItem('savedSubreddits', savedSubreddits);
        // console.log(`Favorited r/${subreddit}`)
    } else {
        localStorage.setItem('savedSubreddits', subreddit);
        // console.log(`Favorited r/${subreddit}`)
    }
    subredditBtn.append('r/' + subreddit);
    subredditSection.append(subredditBtn);
}

function unFavoriteSubreddit(subreddit) {
    // console.log(`Unfavoriting r/${subreddit}`);
    document.querySelector(`.your-subreddits .subreddit.button#${subreddit}`).remove();
    let savedSubreddits = localStorage.getItem('savedSubreddits');
    let newSavedSubreddits = savedSubreddits.split(',').filter(e => e !== subreddit);
    // console.log(newSavedSubreddits);
    localStorage.setItem('savedSubreddits', newSavedSubreddits.toString());
    // console.log(localStorage.getItem('savedSubreddits'));
}

type CommentBuilderOptions = {indent: number, ppBuffer: HTMLImageElement[], post: Permalink};

function displayCommentsRecursive(parentElement: HTMLElement, listing: ApiObj[],  {post, indent=0, ppBuffer=[]}: CommentBuilderOptions) {
    if (listing.length === 0) {
        return;
    }

    for (const redditObj of listing) {
        // At the end of the list reddit adds a "more" object
        if (redditObj.kind === "t1") {
            // kind being t1 assures us listing[0] is a SnooComment
            const comment: SnooComment = redditObj as SnooComment;
            const commentElement = document.createElement("div");
            if (indent > 0) {
                commentElement.classList.add('replied-comment');
            }

            parentElement.appendChild(commentElement);
            const prom: Promise<HTMLElement> = createComment(comment, {ppBuffer: ppBuffer, domNode: commentElement});
            prom.catch( (reason) => {
                console.error("There was a problem drawing this comment on the page", {"reason":reason, "comment data": comment, "profile picture": ppBuffer, "anchor element on the page=": commentElement});
            })

            if (comment.data.replies) {
                displayCommentsRecursive(commentElement, comment.data.replies.data.children, {
                    indent: indent + 10, 
                    ppBuffer: ppBuffer,
                    post: post
                });
            }

            if (indent === 0) {
                parentElement.appendChild(document.createElement('hr'));
            }
        } else if (redditObj.kind === "more" && post !== undefined) {
            const data = redditObj as MoreComments;
            const moreElement = document.createElement("span");
            moreElement.classList.add("btn-more");
            
            // Fetch the parent of the "more" listing
            const parentLink = `${redditBaseURL}${post}${data.data.parent_id.slice(3)}`;
            /*
                // We used to fetch the comment directly listed by the "more" listing aka data.data.id
                // But sometimes 'id' was '_' and no children were listed (despite the fact that there was several on the actual website)
                // If you go back 1 step in the tree to the parent and circle back to the children this way, however, you 
                //   get around the bug and the children get properly listed
                // Couldn't tell you why.
                // If you wish to see the behavior in action, enable this piece of code
                if (data.data.children.length === 0) {
                    if (isDebugMode()) console.log("Empty 'more' object?", redditObj);
                    moreElement.style.backgroundColor = "#ff0000";
                }
            */
            
            moreElement.addEventListener("click", () => {
                moreElement.classList.add("waiting");
                fetch(`${parentLink}.json`)
                    .catch((e) => {
                        moreElement.classList.remove("waiting");
                        console.error(e);
                    })
                    .then((response: Response) => { 
                        return response.json()
                    })
                    .catch((e) => {
                        console.error(e);
                    })
                    .then((data: ApiObj[]) => {
                        if (isDebugMode()) console.log("Got data!", parentLink, data);
                        moreElement.remove();

                        // Our type definitions aren't robust enough to go through the tree properly
                        // We just cop out. Cast as `any` and try/catch.
                        let replies: Listing<SnooComment>;
                        try {
                            replies = (data as any)[1].data.children[0].data.replies.data
                        } catch (e) {
                            return Promise.reject(e);
                        }

                        displayCommentsRecursive(parentElement, replies.children, {
                            indent: indent + 10,
                            ppBuffer: ppBuffer,
                            post: post
                        });
                        return Promise.resolve();
                    });
            });
            parentElement.appendChild(moreElement);
        }
    }
}

function displayComments(commentsData, {post}: {post: Permalink}) {
    console.log(commentsData);
    postSection.classList.add('post-selected');
    postSection.classList.remove('deselected');

    const stableInTimeFaceBuffer = facesSideLoader.getFaces().slice(0); // Stable-in-time copy of the full array
    displayCommentsRecursive(postSection, commentsData, { indent: 0, ppBuffer: stableInTimeFaceBuffer, post: post});
}

let sortButton = document.querySelector('.post-header-button.sort') as HTMLElement;
let sortMenu = document.querySelector('.sort-menu') as HTMLElement;

sortButton.addEventListener('click', function() {
    // console.log(sortMenu.style.display)
    if (sortMenu.style.display == 'none' || sortMenu.style.display == '') {
        // sortButton.style.backgroundColor = '#000';
        sortButton.classList.add('opened');
        sortMenu.style.display = 'flex';
    } else {
        sortButton.classList.remove('opened');
        sortMenu.style.display = 'none';
        let sortTopMenu = document.querySelector('.sort-top-menu') as HTMLButtonElement;
        sortTopMenu.style.display = 'none';
        // sortButton.style.backgroundColor = 'var(--background-color-2)'
    }
})


let sortHot = document.querySelector('.sort-button.hot') as HTMLButtonElement;
sortHot.addEventListener('click', async function() {
    displaySortedPosts('hot', sortButton.id)
})

let sortNew = document.querySelector('.sort-button.new') as HTMLButtonElement;
sortNew.addEventListener('click', async function() {
    displaySortedPosts('new', sortButton.id)
})

let sortRising = document.querySelector('.sort-button.rising') as HTMLButtonElement;
sortRising.addEventListener('click', async function() {
    displaySortedPosts('rising', sortButton.id)
})
let sortTopMenu = document.querySelector('.sort-top-menu') as HTMLButtonElement;

let topButton = document.querySelector('.sort-button.top') as HTMLButtonElement;
topButton.addEventListener('click', function() {
    if ((sortTopMenu.style.display == 'none' || sortTopMenu.style.display == '') && sortMenu.style.display == 'flex') {
        sortTopMenu.style.display = 'flex';
    } else {
        sortTopMenu.style.display = 'none';
    }
})

let themes = [
                'default', 'theme1', 'theme2', 'theme3', 'theme4', 'theme5', 
                'theme6', 'theme7', 'theme8', 'theme9', 'theme10', 'theme11', 
                'theme12', 'theme13', 'theme14', 'theme15', 'theme16'
            ]

let defaultTheme = document.querySelector('.theme-button.default') as HTMLButtonElement; 
let theme1 = document.querySelector('.theme-button.theme1') as HTMLButtonElement;
let theme2 = document.querySelector('.theme-button.theme2') as HTMLButtonElement;
let theme3 = document.querySelector('.theme-button.theme3') as HTMLButtonElement;
let theme4 = document.querySelector('.theme-button.theme4') as HTMLButtonElement;
let theme5 = document.querySelector('.theme-button.theme5') as HTMLButtonElement;
let theme6 = document.querySelector('.theme-button.theme6') as HTMLButtonElement;
let theme7 = document.querySelector('.theme-button.theme7') as HTMLButtonElement;
let theme8 = document.querySelector('.theme-button.theme8') as HTMLButtonElement;
let theme9 = document.querySelector('.theme-button.theme9') as HTMLButtonElement;
let theme10 = document.querySelector('.theme-button.theme10') as HTMLButtonElement;
let theme11 = document.querySelector('.theme-button.theme11') as HTMLButtonElement;
let theme12 = document.querySelector('.theme-button.theme12') as HTMLButtonElement;
let theme13 = document.querySelector('.theme-button.theme13') as HTMLButtonElement;
let theme14  = document.querySelector('.theme-button.theme14') as HTMLButtonElement;
let theme15  = document.querySelector('.theme-button.theme15') as HTMLButtonElement;
let theme16  = document.querySelector('.theme-button.theme16') as HTMLButtonElement;


enableTheme(defaultTheme, 'defaultTheme')
enableTheme(theme1, 'theme1')
enableTheme(theme2, 'theme2')
enableTheme(theme3, 'theme3')
enableTheme(theme4, 'theme4')
enableTheme(theme5, 'theme5')
enableTheme(theme6, 'theme6')
enableTheme(theme7, 'theme7')
enableTheme(theme8, 'theme8')
enableTheme(theme9, 'theme9')
enableTheme(theme10, 'theme10')
enableTheme(theme11, 'theme11')
enableTheme(theme12, 'theme12')
enableTheme(theme13, 'theme13')
enableTheme(theme14, 'theme14')
enableTheme(theme15, 'theme15')
enableTheme(theme16, 'theme16')


function enableTheme(theme, themeClassName) {
    theme.addEventListener('click', function() {
        removeThemeSelected();
        for (let theme of themes) {
            document.body.classList.remove(theme);
        }
        if (!theme.classList.contains('selected')) {
            // if (document.body.classList.contains('defaultTheme')) {
            //     document.body.classList.remove('defaultTheme')
            // }
            document.body.classList.add(themeClassName);
            theme.classList.add('selected');
            // console.log('theme selected:', theme.classList[1])
            localStorage.setItem('currentTheme', theme.classList[1])
        } else {
            theme.classList.remove('selected');
            document.body.classList.remove(themeClassName);
            localStorage.setItem('currentTheme', '')
        }
    })
}

function applySavedTheme() {
    if (localStorage.getItem('currentTheme')) {
        let currentTheme = localStorage.getItem('currentTheme');
        removeThemeSelected();
        document.querySelector(`.theme-button.${currentTheme}`).classList.add('selected');
        document.body.classList.add(currentTheme);
    }
}

function removeThemeSelected() {
    let themeContainer = document.querySelector('.theme-grid-container') as HTMLElement;
    for (let theme of themeContainer.children) {
        theme.classList.remove('selected');
    }
    // (document.querySelector('.navbar') as HTMLElement).style.backgroundImage = 'none';
}


let sortTopDay = document.querySelector('.sort-button.today') as HTMLButtonElement;
sortTopDay.addEventListener('click', async function() {
    displayTopSortedPosts('day', sortButton.id)
})

let sortTopWeek = document.querySelector('.sort-button.week') as HTMLButtonElement;
sortTopWeek.addEventListener('click', async function() {
    displayTopSortedPosts('week', sortButton.id)
})

let sortTopMonth = document.querySelector('.sort-button.month') as HTMLButtonElement;
sortTopMonth.addEventListener('click', async function() {
    displayTopSortedPosts('month', sortButton.id)
})

let sortTopYear = document.querySelector('.sort-button.year') as HTMLButtonElement;
sortTopYear.addEventListener('click', async function() {
    displayTopSortedPosts('year', sortButton.id)
})

let sortTopAll = document.querySelector('.sort-button.all-time') as HTMLButtonElement;
sortTopAll.addEventListener('click', async function() {
    displayTopSortedPosts('all', sortButton.id)
})

async function displaySortedPosts(sortType, subreddit) {
    clearPostsList();
    sortMenu.style.display = 'none';
    sortTopMenu.style.display = 'none';
    sortButton.classList.remove('opened')
    axios.get(`${redditBaseURL}/r/${subreddit}/${sortType}/.json?limit=75`)
        .then(function (response1) {
            const responseData = response1.data.data.children;
            axios.get(`${redditBaseURL}/r/${subreddit}/about.json`)
                .then(function(response2) {
                    const subredditInformation = response2.data;
                    console.log(subredditInformation);
                    displayPosts(responseData, sortButton.id, subredditInformation);
                    // console.log(`displayed ${sortType} posts for`, subreddit)
                })
                .catch((e: Error) => {
                    displayPosts(responseData, sortButton.id);
                    console.error(e);
                })
        })
        .catch((e: Error) => {
            console.error(e);
        })
}

async function displayTopSortedPosts(sortType, subreddit) {
    clearPostsList();
    sortMenu.style.display = 'none';
    sortTopMenu.style.display = 'none';
    sortButton.classList.remove('opened');
    axios.get(`${redditBaseURL}/r/${subreddit}/top.json?t=${sortType}`)
        .then(function (response1) {
            const responseData = response1.data.data.children;
            axios.get(`${redditBaseURL}/r/${subreddit}/about.json`)
                .then(function(response2) {
                    const subredditInformation = response2.data;
                    console.log(subredditInformation);
                    displayPosts(responseData, sortButton.id, subredditInformation);
                    // console.log(`displayed ${sortType} posts for`, subreddit)
                })
                .catch((e: Error) => {
                    displayPosts(responseData, sortButton.id);
                    console.error(e);
                })
        })
        .catch((e: Error) => {
            console.error(e);
        })
}

function showPostFromData(response: ApiObj) {
    try {
        // reset scroll position when user clicks on a new post
        let redditPost: HTMLElement = strictQuerySelector('.reddit-post');
        redditPost.scrollTop = 0;
    } catch (e) { 
        console.error(e);
    }
    
    const comments = response.data[1].data.children;
    const author = document.createElement('span');
    author.append(`Posted by u/${response.data[0].data.children[0].data.author}`);
    author.classList.add('post-author')
    postSection.append(author);
    const title = document.createElement('h4')
    const titleLink = document.createElement('a');
    title.appendChild(titleLink);
    const titleText = response.data[0].data.children[0].data.title
    titleLink.href = `${redditBaseURL}${response.data[0].data.children[0].data.permalink}`;
    titleLink.append(titleText);
    title.classList.add('post-section-title');
    postSection.append(title);
    if (response.data[0].data.children[0].data.post_hint === 'image') {
        let image = document.createElement('img');
        image.src = response.data[0].data.children[0].data.url_overridden_by_dest;
        image.classList.add('post-image');
        postSection.append(image);
    } 
    if (response.data[0].data.children[0].data.selftext !== '' && !response.data[0].data.children[0].data.selftext.includes('preview')) {
        const selftext = document.createElement('div');
        selftext.innerHTML = decodeHtml(response.data[0].data.children[0].data.selftext_html);
        selftext.classList.add("usertext");
        postSection.append(selftext);
    }
    if (!response.data[0].data.children[0].data.is_self && !response.data[0].data.children[0].data.is_reddit_media_domain) {
        const div = document.createElement('div');
        const thumbnail = document.createElement('img');
        const link = document.createElement('a');

        thumbnail.src = response.data[0].data.children[0].data.thumbnail;
        thumbnail.onerror = () => {
            thumbnail.src = 'https://img.icons8.com/3d-fluency/512/news.png';
        };
        link.href = response.data[0].data.children[0].data.url_overridden_by_dest;
        link.innerText = titleText;
        link.target = "_blank";
        link.classList.add('post-link');
        div.append(thumbnail);
        div.append(link);
        div.classList.add('post-link-container')
        postSection.append(div);
    }

    const redditVideo = response?.data[0]?.data?.children[0]?.data?.secure_media?.reddit_video;
    if (redditVideo !== undefined && redditVideo !== "null") {
        const video = document.createElement('video');
        video.classList.add('post-video');
        video.setAttribute('controls', '')
        const source = document.createElement('source');
        source.src = response.data[0].data.children[0].data.secure_media.reddit_video.fallback_url;
        video.appendChild(source);
        postSection.append(video);
    }
    
    const postDetails = getPostDetails(response)
    postSection.append(...postDetails)
    postSection.append(document.createElement('hr'))

    displayComments(comments, { post: response.data[0].data.children[0].data.permalink });
}

function getPostDetails(response: any) {
    let upvotes = document.createElement('span');
    upvotes.innerHTML = '<svg width="15px" height="15px" style="margin-right: 5px;" viewBox="0 0 94 97" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M88.1395 48.8394C84.9395 46.0394 60.4728 18.0061 48.6395 4.33939C46.6395 3.53939 45.1395 4.33939 44.6395 4.83939L4.63948 49.3394C2.1394 53.3394 7.63948 52.8394 9.63948 52.8394H29.1395V88.8394C29.1395 92.0394 32.1395 93.1727 33.6395 93.3394H58.1395C63.3395 93.3394 64.3062 90.3394 64.1395 88.8394V52.3394H87.1395C88.8061 52.0061 91.3395 51.6394 88.1395 48.8394Z" stroke="#818384" stroke-width="7"/></svg>'
    upvotes.append(`${response.data[0].data.children[0].data.ups.toLocaleString()}`);
    upvotes.innerHTML += '<svg width="15px" height="15px" style="transform: rotate(180deg); margin-left: 5px" viewBox="0 0 94 97" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M88.1395 48.8394C84.9395 46.0394 60.4728 18.0061 48.6395 4.33939C46.6395 3.53939 45.1395 4.33939 44.6395 4.83939L4.63948 49.3394C2.1394 53.3394 7.63948 52.8394 9.63948 52.8394H29.1395V88.8394C29.1395 92.0394 32.1395 93.1727 33.6395 93.3394H58.1395C63.3395 93.3394 64.3062 90.3394 64.1395 88.8394V52.3394H87.1395C88.8061 52.0061 91.3395 51.6394 88.1395 48.8394Z" stroke="#818384" stroke-width="7"/></svg>'
    upvotes.classList.add('post-detail-info')
    let subreddit = document.createElement('span');
    subreddit.classList.add('post-detail-info')
    subreddit.append(response.data[0].data.children[0].data.subreddit_name_prefixed);
    let numComments = document.createElement('span');
    numComments.append(`${response.data[0].data.children[0].data.num_comments.toLocaleString()} Comments`);
    numComments.classList.add('post-detail-info')
    let author = document.createElement('span');
    author.append(`Posted by u/${response.data[0].data.children[0].data.author}`);
    author.classList.add('post-detail-info')
    return [upvotes, subreddit, numComments, author];
}

async function generateGnomePic(): Promise<HTMLImageElement> {
    const gnome = document.createElement<"img">("img");
    gnome.classList.add("gnome");

    // Potential Hmirror 
    const flipSeed = await rng.random();
    const flip = flipSeed <= 0.5 ? "scaleX(-1) " : "";

    // +Random rotation between -20deg +20deg
    const mirrorSeed = await rng.random();
    gnome.style.transform = `${flip}rotate(${Math.round(mirrorSeed * 40 - 20)}deg) `;
    
    const colorSeed = await rng.random();
    gnome.style.backgroundColor = colors[Math.floor(colorSeed * colors.length)];

    return gnome;
}

async function generateTextPic(commentData: SnooComment, size: number): Promise<HTMLSpanElement> {
    const textPic = document.createElement<"span">("span");

    const pseudoRand1 = await rng.random(0, initials.length-1);
    const pseudoRand2 = await rng.random(0, initials.length-1);
    const ppInitials = initials[Math.round(pseudoRand1)] + initials[Math.round(pseudoRand2)];

    textPic.style.fontWeight = "600";
    textPic.style.fontSize = "16px";
    textPic.style.lineHeight = "40px";
    textPic.style.textAlign = "center";
    textPic.style.display = "inline-block";
    textPic.style.cssText += "-webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";

    const colorSeed = await rng.random(0, colors.length-1);
    textPic.style.backgroundColor = colors[Math.round(colorSeed)];
    
    textPic.textContent = `${ppInitials}`;
    return textPic;
}

function copyImage2Canvas(origin: HTMLImageElement, newSize: number): HTMLCanvasElement | null {
    const canv: HTMLCanvasElement = document.createElement("canvas");

    // canvas will sample 4 pixels per pixel displayed then be downsized via css
    // otherwise if 1px = 1px the picture looks pixelated & jagged
    // css seems to do a small cubic interpolation when downsizing, and it makes a world of difference
    canv.height = canv.width = newSize * 2;

    canv.style.height = canv.style.width = newSize.toString();
    const ctx: CanvasRenderingContext2D | null = canv.getContext('2d');

    if (ctx !== null) {
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = "high";
        try {
            ctx.drawImage(origin, 0, 0, newSize * 2, newSize * 2);
        } catch (e) {
            console.error(origin, e);
        }
        
        return canv;
    } else {
        return null;
    }
}

async function generateFacePic(commentData: SnooComment, ppBuffer: HTMLImageElement[], displaySize: number = 50): Promise<HTMLCanvasElement> {
    const imageSeed = Math.round(await rng.random(0, ppBuffer.length-1));
    const imageElement: HTMLImageElement = ppBuffer[imageSeed];

    // Purpose of copying: A single <img> tag cannot be in multiple spots at the same time
    // I did not find a way to duplicate the reference to an img tag 
    // If you use Element.appendChild with the same reference multiple times, the method will move the element around
    // Creating a new <img> tag and copying the attributes would work, but it would fetch the src again
    // The image at thispersondoesnotexist changes every second so the src points to a new picture now
    // Since the URL has a parameter and hasn't changed, then most likely, querying the URL again would
    //     hit the browser's cache. but we can't know that.
    // Solution: make a canvas and give it the single <img> reference. It makes a new one every time. It doesn't query the src.
    const canv = copyImage2Canvas(imageElement, displaySize);
    assert(canv !== null, `generateFacePic couldn't get a canvas 2D context from image #${imageSeed}, ${imageElement.src} (img.${Array.from(imageElement.classList).join(".")})`);

    canv.classList.add(`human-${imageSeed}`);
    return canv;
}

type HTMLProfilePictureElement = HTMLCanvasElement | HTMLImageElement | HTMLSpanElement;
async function createProfilePicture(commentData: SnooComment, size: number = 50, ppBuffer: HTMLImageElement[] = []): Promise<HTMLProfilePictureElement> {
    async function helper(): Promise<HTMLProfilePictureElement> {
        if (commentData.data.subreddit === "gnometalk") {
            return generateGnomePic();
        } else {
            // 0-10  => 0
            // 10-25 => Between 0 and 0.7
            // 25+   => 0.7
            // Don't replace this with a formula filled with Math.min(), 
            //    divisions and substractions, this is meant to be readable for a beginner
            const chanceForAFacePic = (() => {
                if (ppBuffer.length < 10) {
                    return 0;
                } else {
                    const baseValue = 0.7; // Max .7

                    // What percentage of progress are you between 10 and 25
                    if (ppBuffer.length >= 25) {
                        return baseValue;
                    } else {
                        return ((ppBuffer.length - 10)/15)*baseValue;
                    }
                }
            })();

            if ((await rng.random()) < chanceForAFacePic) {
                return generateFacePic(commentData, ppBuffer);
            } else {
                return generateTextPic(commentData, size);
            }
        }
    }

    const ppElem: HTMLProfilePictureElement = await helper();

    ppElem.classList.add("avatar")
    ppElem.style.marginRight = "10px";
    if (!ppElem.classList.contains("avatar-circle")) {
        ppElem.classList.add("avatar-circle");
    }
    return ppElem;
}

// localStorage.setItem('showLongAddress', 'true');

type CreateCommentOptions = {
    ppBuffer: HTMLImageElement[],
    domNode?: HTMLElement
};
async function createComment(commentData: SnooComment, options: CreateCommentOptions={ppBuffer: []}): Promise<HTMLElement> {
    if (options.domNode === undefined) {
        options.domNode = document.createElement('div');
    }
    options.domNode.id = commentData.data.id;
    options.domNode.classList.add("usertext");

    // Author parent div
    const author = document.createElement('div');
    author.classList.add("author")
    author.style.display = "flex";

    await rng.setSeed(commentData.data.author);
    
    // Placeholder pic
    const ppSize = 50; //px
    const pfpPlaceHolder = document.createElement<"span">("span");
    pfpPlaceHolder.style.width = pfpPlaceHolder.style.height = `${ppSize}px`;
    author.appendChild(pfpPlaceHolder);

    // Real Profile pic
    createProfilePicture(commentData, ppSize, options.ppBuffer).then( (generatedPfp) => {
        author.replaceChild(generatedPfp, pfpPlaceHolder);
    });

    // Author's name and sent date
    let authorText = document.createElement("div");
    authorText.classList.add("author-text")
    authorText.style.display = "flex";
    authorText.style.flexDirection = "column";
    {
        // Name
        let authorTextInfo = document.createElement("span");
        authorTextInfo.classList.add("username")
        authorTextInfo.classList.add("email")
        const scoreLength = (""+commentData.data.score).length
        
        // Email addresses are composed of uuids and hide the score within the first block
        const format: UUIDFormat = [
            { n: 8, charset: "alpha" }, // // First section is only letters to avoid ambiguity on the score
            { n: 4, charset: "alphanumerical" },
            { n: 4, charset: "alphanumerical" },
            { n: 4, charset: "alphanumerical" },
            { n: 12, charset: "alphanumerical" }
        ];
        rng.randomUUID(format).then((uuid: UUID) => {
            const slicedUUID = uuid.slice(scoreLength); // Remove a bunch of letters from the start

            // We overwrite the 1st section with the comment's score
            if (localStorage.getItem('showLongAddress') == 'true' || localStorage.getItem('showLongAddress') == null) {
                authorTextInfo.innerHTML = `${commentData.data.author} <${commentData.data.score}${slicedUUID}@securemail.org>`;
            } else {
                authorTextInfo.innerHTML = `u/${commentData.data.author} (${commentData.data.score})`;
                authorTextInfo.title = `&lt;${commentData.data.author}@reddit.com&gt;`
            }
        })
        authorText.append(authorTextInfo);

        // Sent date
        let d = new Date(commentData.data.created_utc*1000);
        const dateDiv = document.createElement("span");
        dateDiv.classList.add("comment-posted-date")
        dateDiv.innerHTML = d.toString().slice(0,21);
        dateDiv.style.color = "#a2a2a2";
        dateDiv.style.fontSize = "0.85em";
        authorText.append(dateDiv);
    }
    author.append(authorText);

    const commentText = document.createElement('div');
    commentText.classList.add("comment");
    commentText.insertAdjacentHTML('beforeend', decodeHtml(commentData.data.body_html));

    options.domNode.prepend(author, commentText);
    return options.domNode
}

type SerializedHTML = string;
function decodeHtml(html: SerializedHTML): SerializedHTML {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function clearPost() {
    postSection.innerHTML = '';
    sortMenu.style.display = 'none';
    sortTopMenu.style.display = 'none';
    sortButton.classList.remove('opened');
    subredditInfoContainer.style.display = 'none';
    headerButtons.style.borderRadius = "4px 4px 0px 0px";
}

function clearPostSection() {
    postSection.innerHTML = '';
}

function clearPostsList() {
    const posts = document.querySelector('#posts');
    if (posts !== null) {
        posts.innerHTML = '';
        subredditInfoContainer.style.display = 'none';
        headerButtons.style.borderRadius = "4px 4px 0px 0px";
    }
}


const searchForm: HTMLFormElement = strictQuerySelector('form');
const subredditName: HTMLInputElement = strictQuerySelector('input');
const subredditSection: HTMLElement = strictQuerySelector('.your-subreddits')

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    showSubreddit(subredditName.value);
    // let subredditBtn: HTMLButtonElement = document.createElement<"button">('button');
    // subredditBtn.classList.add('subreddit', 'button');
    // subredditBtn.id = subredditName.value;
    // subredditBtn.addEventListener('click', async () => {
    //     clearPost();
    //     if (isDebugMode()) console.log("custom sub click", subredditBtn.id);
    //     setURLAnchor(`/r/${subredditBtn.id}`);
    //     showSubreddit(subredditBtn.id);
    // })
    // // document.cookie.subreddits.append(subreddit.value);
    // if (localStorage.getItem('savedSubreddits')) {
    //     let savedSubreddits = localStorage.getItem('savedSubreddits');
    //     savedSubreddits += `,${subredditName.value}`;
    //     localStorage.setItem('savedSubreddits', savedSubreddits);
    // } else {
    //     localStorage.setItem('savedSubreddits', subredditName.value);
    // }
    // subredditBtn.append('r/' + subredditName.value);
    // subredditSection.append(subredditBtn);
    // subredditName.value = '';
    (document.querySelector('.search-results') as HTMLElement).style.display = 'none';
    // subredditName.value = '';
})

function displaySavedSubreddits() {
    let savedSubreddits = getSavedSubreddits()    
    if (savedSubreddits) {
        for (let savedSubreddit of savedSubreddits) {
            let subredditBtn = document.createElement('button');
            subredditBtn.classList.add('subreddit', 'button');
            subredditBtn.id = savedSubreddit;
            subredditBtn.addEventListener('click', async () => {
                clearPost();
                if (isDebugMode()) console.log("custom sub click", subredditBtn.id);
                setURLAnchor(`/r/${subredditBtn.id}`);
                showSubreddit(subredditBtn.id);
            })
            subredditBtn.append('r/' + savedSubreddit);
            subredditSection.append(subredditBtn);
        }
    }
}

function getSavedSubreddits() {
    if (localStorage.getItem('savedSubreddits')) {
        // console.log(localStorage.getItem('savedSubreddits'));
        let savedSubreddits = localStorage.getItem('savedSubreddits');
        return savedSubreddits.split(',');
    } else {
        // localStorage.setItem('savedSubreddits', '');
        return false
    }
    
}

function removeSavedSubreddit(subreddit) {
    let savedSubreddits = getSavedSubreddits();
    if (savedSubreddits) {
        savedSubreddits = savedSubreddits.filter(function(e) { return e !== subreddit });
        localStorage.setItem('savedSubreddits', savedSubreddits.toString());
    }
}

displaySavedSubreddits();

const popularSubreddits: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.popular-subreddits>button')

for (let subreddit of popularSubreddits) {
    subreddit.addEventListener('click', async () => {
        if (isDebugMode()) console.log("default sub click", subreddit.id);
        setURLAnchor(`/r/${subreddit.id}`);
        clearPost();
        showSubreddit(subreddit.id);
    })
}


// let clicked = false;
// const markAsRead: HTMLElement = strictQuerySelector('.mark-as-read-btn');
// markAsRead.addEventListener('click', () => {
//     if (!clicked) {
//         alert('This button literally does nothing')
//         clicked = true;
//     }
// })

const inboxButton: HTMLElement = strictQuerySelector('.inbox-button');
inboxButton.addEventListener('click', async () => {
    if (isDebugMode()) console.log("inbox click", "/r/popular");
    setURLAnchor("/r/popular");
    clearPost();
    showSubreddit('popular');
})

function isHTMLElement(obj: any): obj is HTMLElement {
    return (typeof obj === "object") && (obj as HTMLElement).style !== undefined;
}

let collapsible: NodeListOf<HTMLElement> = document.querySelectorAll(".collapsible");
for (let coll of collapsible) {
    coll.addEventListener("click", function() {
        // this.classList.toggle("active");
        let content = this?.nextElementSibling;
        if (!isHTMLElement(content)) {
            return;
        }
        
        let nextSibling = this?.firstChild?.nextSibling;
        if (!isHTMLElement(nextSibling)) {
            return;
        }
        
        if (content.style.display === "none") {
            nextSibling.classList.remove('ms-Icon--ChevronRight')
            nextSibling.classList.add('ms-Icon--ChevronDownMed')
            content.style.display = "block";
        } else {
            nextSibling.classList.remove('ms-Icon--ChevronDownMed')
            nextSibling.classList.add('ms-Icon--ChevronRight')
            content.style.display = "none";
        }
    });
}

const BORDER_SIZE = 4;
const panel: HTMLElement = strictQuerySelector(".post-sidebar");

let m_pos: number;
function resize(e: MouseEvent){
  const dx = m_pos - e.x;
  m_pos = e.x;
  panel.style.width = `${(parseInt(getComputedStyle(panel, '').width) + dx)}px`;
}

panel.addEventListener("mousedown", function(e: MouseEvent){
  if (e.offsetX < BORDER_SIZE) {
    m_pos = e.x;
    document.addEventListener("mousemove", resize, false);
  }
}, false);

document.addEventListener("mouseup", function(){
    document.removeEventListener("mousemove", resize, false);
}, false);

let settingsButton: HTMLElement = strictQuerySelector('.settings-button');
let settingsPanel: HTMLElement = strictQuerySelector('.settings-panel');

settingsButton.addEventListener('click', () => {
    profilePanel.classList.remove('profile-panel-show');
    settingsPanel.classList.toggle('settings-panel-show');
})

let closeButton: HTMLElement = strictQuerySelector('.close-settings');

closeButton.addEventListener('click', () => {
    settingsPanel.classList.remove('settings-panel-show');
})


const checkbox: HTMLInputElement = strictQuerySelector('#flexSwitchCheckChecked');
checkbox.addEventListener('change', function() {
    const body = strictQuerySelector('body');
    if (checkbox.checked) {
        body.classList.remove('light')
        body.classList.add('dark')
        localStorage.setItem('isDarkMode', 'true');
    } else {
        body.classList.remove('dark')
        body.classList.add('light')
        localStorage.setItem('isDarkMode', 'false');
    }
})

function setDarkMode() {
    if (localStorage.getItem('isDarkMode') == 'true') {
        checkbox.checked = true;
        strictQuerySelector('body').classList.remove('light');
        strictQuerySelector('body').classList.add('dark');
    } else if (localStorage.getItem('isDarkMode') == 'false') {
        strictQuerySelector('body').classList.remove('dark');
        strictQuerySelector('body').classList.add('light');
        checkbox.checked = false;
    }    
}

const checkbox2: HTMLInputElement = strictQuerySelector('#show-subreddit-details');
checkbox2.addEventListener('change', function() {
    const body = strictQuerySelector('body');
    if (checkbox2.checked) {
        localStorage.setItem('showSubDetails', 'true');
        (document.querySelector('.subreddit-info') as HTMLElement).style.display = 'flex';
        scrollable.style.height = 'calc(100vh - 273px)';
    } else {
        localStorage.setItem('showSubDetails', 'false');
        (document.querySelector('.subreddit-info') as HTMLElement).style.display = 'none';
        subredditInfoContainer.style.display = 'none';
        headerButtons.style.borderRadius = "4px 4px 0px 0px";
        scrollable.style.height = 'calc(100vh - 178px)';
    }
})

function showSubredditDetails() {
    if (localStorage.getItem('showSubDetails') == 'true') {
        checkbox2.checked = true;
    } else if (localStorage.getItem('showSubDetails') == 'false') {
        checkbox2.checked = false;
    }    
}

const checkbox3: HTMLInputElement = strictQuerySelector('#show-long-emails');
checkbox3.addEventListener('change', function() {
    const body = strictQuerySelector('body');
    if (checkbox3.checked) {
        localStorage.setItem('showLongAddress', 'true');
    } else {
        localStorage.setItem('showLongAddress', 'false');
    }
})

function showLongAddress() {
    if (localStorage.getItem('showLongAddress') == 'true') {
        checkbox3.checked = true;
    } else if (localStorage.getItem('showLongAddress') == 'false') {
        checkbox3.checked = false;
    }    
}

window.addEventListener("hashchange", () => {
    clearPost();
    const permalink = permalinkFromURLAnchor();
    if (isDebugMode()) console.log(`history buttons clicked`, permalink);
    showRedditPageOrDefault(permalink);
});

let profileButton: HTMLElement = strictQuerySelector('.profile-button');
let profilePanel: HTMLElement = strictQuerySelector('.profile-panel');

profileButton.addEventListener('click', () => {
    settingsPanel.classList.remove('settings-panel-show');
    profilePanel.classList.toggle('profile-panel-show');
})


document.addEventListener('click', function handleClickOutsideBox(event) {
	let searchResults = document.querySelector('.search-results');
    // let sortMenu = document.querySelector('.sort-menu') as HTMLElement;
    // let sortTopMenu = document.querySelector('.sort-top-menu') as HTMLElement;

    let target = event.target as Node;

    // hdie search results/open menus if user clicks out of it
	if (!searchResults.contains(target)) {hideSearchResults()}
	// if (!sortMenu.contains(target)) {sortMenu.style.display = 'none';}
    // if (!sortTopMenu.contains(target)) {sortTopMenu.style.display = 'none';}
});



let inputBox = document.querySelector(".search") as HTMLInputElement;
if (subredditName) {
    subredditName.addEventListener('input', function() {
    // searchBoxClicked();
	// console.log(inputBox.value)
	if (subredditName.value.length > 0) {
        if (subredditName.value.startsWith('r/')) {
            let results = subreddits.filter(sub => sub.subreddit.toLowerCase().includes(inputBox.value.toLowerCase().slice(2)));
            displaySearchResults(results.slice(0, 5))
        } else {
            let results = subreddits.filter(sub => sub.subreddit.toLowerCase().includes(inputBox.value.toLowerCase()));
            displaySearchResults(results.slice(0, 5))
        }
		// console.log(results.slice(0, 5));
	} else {
		hideSearchResults()
	}
  });
//   subredditName.addEventListener('click', function() {
//     // searchBoxClicked();
// 	// console.log(inputBox.value)
// 	if (subredditName.value.length > 0) {
//         let results = subreddits.filter(sub => sub.subreddit.toLowerCase().includes(subredditName.value.toLowerCase()));
// 		displaySearchResults(results.slice(0, 5))
// 	} else {
// 		hideSearchResults()
// 	}
//   });
}

function displaySearchResults(results) {
    let searchResults = document.querySelector('.search-results') as HTMLElement;
    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    for (let result of results) {
        searchResults.innerHTML += `<a href="#/r/${result.subreddit}" class="search-result-link"><div class="search-result-item"><img src="${result.icon}" class="search-subreddit-icon"><div class="search-result-item-info"><div class="search-result-subreddit-name">r/${result.subreddit}</div><div class="search-result-subreddit-info">Community • ${numberFormatter(result.members)} members</div></div><button class="add-subreddit-button" id="${result.subreddit}">+</button></div></a>`
        // console.log(searchResultItem)
        let searchResultLinks = document.querySelectorAll('.search-result-link');

        for (let searchResultLink of searchResultLinks) {
            searchResultLink.addEventListener('click', function() {
                console.log('clicked');
                hideSearchResults();
                // inputBox.value = '';
                // let yourSubredditsSection = document.querySelector('.your-subreddits')
                // subredditSection.innerHTML += `<button class="subreddit button" id="${this.id}">r/${this.id}</button>`
            })
        }
    }
}


function hideSearchResults() {
	let searchResults = document.querySelector('.search-results') as HTMLElement;
    searchResults.style.display = 'none';
}

function numberFormatter(number) {
	let num = parseInt(number)
    return Math.abs(num) > 999999 ? Math.sign(num)*Number((Math.abs(num)/1000000).toFixed(1)) + 'm' : Math.sign(num)*Number((Math.abs(num)/1000).toFixed(1)) + 'k'
}

setDarkMode();  
showSubredditDetails();
showLongAddress();
applySavedTheme();

// Everything set up.
// We start actually doing things now

if (isDebugMode()) {
    // Remove loading screen
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }
}

const permalink = permalinkFromURLAnchor();
showRedditPageOrDefault(permalink);


