import React from 'react';
import BookmarkArticleList from './bookmarkArticleList';


function Bookmarks({currentUser, match})  {
    var urlStringLast  = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    if(currentUser!=null){
      return (
          <div>
            <h2>{currentUser.userName}의 {urlStringLast==="replays"?"리플레이":"시나리오"} 북마크</h2>
            <div>
              <BookmarkArticleList currentUser={currentUser}/>
            </div>
          </div>
      );
    }else{
      return (<div></div>);
    }
}
export default Bookmarks;