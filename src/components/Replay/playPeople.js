import React from 'react';

const e = React.createElement;
class MakePlayPeople extends React.Component {
    constructor(props) {
        super(props);
        if(window.peoples == null){
            console.log(window.peoples)
            this.state = {
                is_need_master: true,
                players: [{ playerName: "", characters: [] }],        
                master : "", 
            };
        }else{
            console.log(window.peoples)
            this.state = {
                is_need_master: window.peoples.master==null?false:true,
                players: window.peoples.players == null?[{ playerName: "", characters: [] }]:window.peoples.players,
                master : window.peoples.master==null?"":window.peoples.master,
            };
        }
    }

    addPlayers = (event) => {
        event.preventDefault();
        this.setState((state) => {
            state.players.push({ playerName: "", characters: [] });
        });
        this.forceUpdate();
    }
    removePlayers = (event) => {
        event.preventDefault();
        var deletePlayer = event.target.parentElement;
        this.setState((state) => {
            state.players.splice(deletePlayer.getAttribute('data-player'), 1);
        });

        this.forceUpdate();
    }
    addCharacters = (event) => {
        event.preventDefault();
        var addCharacter = event.target.parentElement.querySelector('.character_container');
        this.setState((state) => {
            state.players[Number(addCharacter.getAttribute('data-player'))].characters.push({ characterName: "" });
        });
        this.forceUpdate();
    }
    removeCharacters = (event) => {
        event.preventDefault();
        var deletePlayer = event.target.parentElement.parentElement;
        var deleteCharacter = event.target.parentElement;
       var playerIndex = Number(deletePlayer.getAttribute('data-player'));
        this.setState((state) => {
            state.players[playerIndex].characters.splice(Number(deleteCharacter.getAttribute("data-character")), 1);
        });
        this.forceUpdate();
    }

    checkNeedMaster = (event) => {
        this.setState({
            is_need_master: this.state.is_need_master ? false : true
        })
    }
    changePlayer = (event) => {
        event.preventDefault();
        var editPlayerBox = event.target.parentElement;
        var edit = event.target.value;
        this.setState((state) => {
            state.players[Number(editPlayerBox.getAttribute('data-player'))].playerName = edit;
        })
        this.forceUpdate();
    }
    getPlayerBox(player_id, data) {
        var player = e("div", { className: "player_box", id: "playerBox_" + player_id, "data-player": player_id, key: player_id },
            e("button", { type: "button", className: "delete-btn", onClick: this.removePlayers }, "X"),
            e("label", { htmlFor: "player_name" }, "플레이어"),
            e("input", { type: "text", className: "form-control player-search", name: "player_name", value: data.playerName, onChange: this.changePlayer, placeholder: "플레이어의 닉네임" }),
            e("span", null, "담당한 캐릭터",
                e("button", { type: "button", className: "add_character", onClick: this.addCharacters }, "캐릭터 추가"),
                e("div", { className: "character_container", "data-player": player_id },
                    data.characters.map((value, index) => { return this.getCharacterBox(player_id, index, value) }))
            ),
        );
        return player;
    }
    getCharacterBox(player_id, character_id, data) {
        var character = e("div", { className: "character_box", id: "character_box_" + character_id, "data-character": character_id, key: character_id },
            e("button", { type: "button", className: "delete-btn", onClick: this.removeCharacters }, "X"),
            e("label", { htmlFor: "character_name_" + player_id }, "캐릭터"),
            e("input", { type: "text", className: "character-search", name: "character_name_" + player_id, value: data.characterName, onChange: this.changeCharacter, placeholder: "캐릭터의 이름" })
        );
        return character;
    }

    changeCharacter = (event) => {
        event.preventDefault();
        var editPlayerBox = event.target.parentElement.parentElement;
        var edit = event.target.value;
        var playerIndex = Number(editPlayerBox.getAttribute('data-player'));
        var characterIndex =  Number(event.target.parentElement.getAttribute('data-character'));
        this.setState((state) => {
             state.players[playerIndex].characters[ characterIndex].characterName=edit;
        })
        this.forceUpdate();
    }
    
    changeMaster = (event) => {
        event.preventDefault();
        var edit = event.target.value;
        this.setState((state) => {
             state.master=edit;
        })
        this.forceUpdate();
    }
    render() {
        var master = e("div", { className: "master_box" },
            e("label", { htmlFor: "master_name" }, "마스터"),
            e("input", { type: "text", className: "form-control master-search", name: "master_name", value:this.state.master ,onChange:this.changeMaster, placeholder: "마스터의 닉네임을 적어주세요" })
        );

        var component =
            e("div", null,
                e("span", null, "플레이한 사람들"),
                e("input", { type: "hidden", name: "play_peoples" }),
                e("div", {className:"form-group"}, 
                    e("label", { htmlFor: "is_need_master" }, "마스터가 없습니다."),
                this.state.is_need_master?
                    e("input", { className:"form-control", type: "checkbox", name: "is_need_master", onChange: this.checkNeedMaster }):
                    e("input", { className:"form-control", type: "checkbox", name: "is_need_master", onChange: this.checkNeedMaster, checked:true })
                ),
                this.state.is_need_master ? master : null,
                e("div", { className: "player_container" },
                    e("button", { type: "button", className: "add_player", onClick: this.addPlayers }, "플레이어 추가"),
                    this.state.players.map((value, index) => {
                        return this.getPlayerBox(index, value)
                    })),
            );
        return component;
    }
}
export default MakePlayPeople;
// ReactDOM.render(e(MakePlayPeople), document.querySelector('.playPeople'));
