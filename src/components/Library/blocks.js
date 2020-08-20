import React from 'react';
import BlockArticleList from './blockArticleList';
import BlockUserList from './blockUserList';

function Blocks({currentUser, match})  {
    var urlStringLast  = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    if(currentUser!=null){
      return (
          <div>
            <h2>{currentUser.userName}의 {urlStringLast==="replays"?"리플레이":urlStringLast==="scenarios"?"시나리오":"유저"} 차단 목록</h2>
            <div>
              {urlStringLast==="replays"||urlStringLast==="scenarios"?<BlockArticleList currentUser={currentUser}/>:<BlockUserList currentUser={currentUser}/>}
            </div>
          </div>
      );
    }else{
      return (<div></div>);
    }
}
export default Blocks;