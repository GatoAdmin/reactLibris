import React from 'react';
import axios from 'axios';

const e = React.createElement;
class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // profile: {
            //     introduction: null,
            //     contacts: [{
            //         contactType:null,
            //         contact:null
            //     }], //연락 가능한 트위터 아이디 같은것
            //     preferPlayStyle: { //선호 스타일
            //         playTypes: [],//온라인(보이스, 텍스트), 오프라인
            //         canConditions: [] //관전허용, 2차캐릭터 허용, 초면 가능, 타세션PC허용
            //     },
            //     preferRules: [{
            //         rule: null,
            //         rule_tag: null,
            //         rule_kind : null,
            //     }], //선호룰
            //     canMasterRules: [{
            //         rule: null,
            //         rule_tag: null,
            //         rule_kind : null,
            //     }], //마스터링 가능 룰
            //     haveRules: [{//가지고 있는 룰북 
            //         title: null,
            //         title_tag: null,
            //         // language: null,
            //         kind : null,
            //         // supplements: [{
            //         //     title: null,
            //         //     title_tag: null,
            //         //     // language: null,
            //         //     kind : null,
            //         // }] //룰마다 서플리먼트 체크 가능
            //     }],
            //     wentToScenarios: [{ //다녀온 시나리오
            //         title: null,
            //         author: null,//TODO: 또는 우리 회원의 아이디 링크 
            //         rule: null,
            //         rule_tag: null,
            //         rule_kind : null,
            //     }],
            //     canMasterScenarios: [{ //마스터가능 시나리오
            //         title: null,
            //         author: null,//TODO: 또는 우리 회원의 아이디 링크 
            //         rule: null,
            //         rule_tag: null,
            //         rule_kind : null,
            //     }],
            //     ngMaterials : []

            // },   
            profile:props.profile,
            masterTagRules:props.masterTagRules   
        };
    }

    addHaveRules = (event) => {
        event.preventDefault();
        this.setState((state) => {
            state.profile.haveRules.push({rule:"",rule_tag:"",rule_kind:""});
        });
        this.forceUpdate();
    }

    // addHaveRules = (event) => {
    //     event.preventDefault();
    //     this.setState((state) => {
    //         state.profile.haveRules.push({ ruleName: "", supplements: [] });
    //     });
    //     this.forceUpdate();
    // }
    // removeHaveRules = (event) => {
    //     event.preventDefault();
    //     var deleteRule = event.target.parentElement;
    //     this.setState((state) => {
    //         state.profile.haveRules.splice(deleteRule.getAttribute('data-rule'), 1);
    //     });

    //     this.forceUpdate();
    // }
    // addSupplements = (event) => {
    //     event.preventDefault();
    //     var addSupplement = event.target.parentElement.querySelector('.supplement_container');
    //     this.setState((state) => {
    //         state.profile.haveRules[Number(addSupplement.getAttribute('data-rule'))].supplements.push({ supplementName: "" });
    //     });
    //     this.forceUpdate();
    // }
    // removeSupplements = (event) => {
    //     event.preventDefault();
    //     var deleteRule = Number(event.target.parentElement.parentElement.getAttribute('data-rule'));
    //     var deleteSupplement = event.target.parentElement;
    //     this.setState((state) => {
    //         state.profile.haveRules[deleteRule].supplements.splice(Number(deleteSupplement.getAttribute("data-supplement")), 1);
    //     });
    //     this.forceUpdate();
    // }
    
    changeHaveRule = (event) => {
        event.preventDefault();
        var editRuleBox = event.target.parentElement;
        var edit = event.target.value;
        this.setState((state) => {
            state.profile.haveRules[Number(editRuleBox.getAttribute('data-rule'))].title = edit;
        })
        this.forceUpdate();
    }
    // changeHaveRuleLanguage = (event) => {
    //     event.preventDefault();
    //     var editRuleBox = event.target.parentElement;
    //     var edit = event.target.value;
    //     this.setState((state) => {
    //         state.profile.haveRules[Number(editRuleBox.getAttribute('data-rule'))].language = edit;
    //     })
    //     this.forceUpdate();
    // }

    // getHaveRuleBox(rule_id, data) {
    //     var rule = e("div", { className: "rule_box", "data-rule": rule_id, "data-type": 'haveRules',key: rule_id },
    //         e("button", { type: "button", className: "delete-btn", onClick: this.removeHaveRules }, "X"),
    //         e("label", { htmlFor: "rule_name" }, "룰"),
    //         e("input", { type: "text", className: "form-control rule_name_search", name: "rule_name_"+rule_id, value: data.title, onChange: this.changeHaveRule, placeholder: "룰의 명칭" }),
    //         // e("input", { type: "text", className: "form-control rule_language_search", name: "rule_language_"+rule_id, value: data.language, onChange: this.changeHaveRuleLanguage, placeholder: "룰의 언어" }),
    //         // e("span", null, 
    //         //     e("button", { type: "button", className: "add_supplement", onClick: this.addSupplements }, "서플리먼트 추가"),
    //         //     e("div", { className: "supplement_container", "data-rule": rule_id },
    //         //         data.supplements.map((value, index) => { return this.getSupplementBox(rule_id, index, value) }))
    //         // ),
    //     );
    //     return rule;
    // }
    // getSupplementBox(rule_id, supplement_id, data) {
    //     var supplement = e("div", { className: "supplement_box", id: "supplement_box_"+rule_id+"_" + supplement_id, "data-supplement": supplement_id, key: supplement_id },
    //         e("button", { type: "button", className: "delete-btn", onClick: this.removeSupplements }, "X"),
    //         e("label", { htmlFor: "supplement_name_" + rule_id }, "서플리먼트"),
    //         e("input", { type: "text", className: "supplement_title_search", name: "supplement_title_" +rule_id +"_"+supplement_id, value: data.title, onChange: this.changeSupplementTitle, placeholder: "서플리먼트의 이름" }),
    //         e("input", { type: "text", className: "supplement_language_search", name: "supplement_language_" +rule_id +"_"+supplement_id, value: data.language, onChange: this.changeSupplementLanguage, placeholder: "서플리먼트의 언어" })
    //     );
    //     return supplement;
    // }

    // changeSupplementTitle = (event) => {
    //     event.preventDefault();
    //     var editRuleBox = event.target.parentElement.parentElement;
    //     var edit = event.target.value;
    //     var ruleIndex = Number(editRuleBox.getAttribute('data-rule'));
    //     var supplementIndex =  Number(event.target.parentElement.getAttribute('data-supplement'));
    //     this.setState((state) => {
    //          state.profile.haveRules[ruleIndex].supplements[supplementIndex].title=edit;
    //     })
    //     this.forceUpdate();
    // }
    
    // changeSupplementLanguage = (event) => {
    //     event.preventDefault();
    //     var editRuleBox = event.target.parentElement.parentElement;
    //     var edit = event.target.value;
    //     var ruleIndex = Number(editRuleBox.getAttribute('data-rule'));
    //     var supplementIndex =  Number(event.target.parentElement.getAttribute('data-supplement'));
    //     this.setState((state) => {
    //          state.profile.haveRules[ruleIndex].supplements[supplementIndex].language=edit;
    //     })
    //     this.forceUpdate();
    // }

    addPreferRules = (event) => {
        event.preventDefault();
        this.setState((state) => {
            state.profile.preferRules.push({rule:"",rule_tag:"",rule_kind:""});
        });
        this.forceUpdate();
    }

    addCanMasterRules = (event) => {
        event.preventDefault();
        this.setState((state) => {
            state.profile.canMasterRules.push({rule:"",rule_tag:"",rule_kind:""});
        });
        this.forceUpdate();
    }

    removeRules = (event) => {
        event.preventDefault();
        var deleteBox = event.target.parentElement; 
        var deleteType = deleteBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[deleteType].splice(deleteBox.getAttribute('data-rule'), 1);
        });

        this.forceUpdate();
    }

    changeRule = (event) => {
        event.preventDefault();
        var editRuleBox = event.target.parentElement;
        var edit = event.target.value;
        var editType = editRuleBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[editType][Number(editRuleBox.getAttribute('data-rule'))].rule_kind = "ETC";
            state.profile[editType][Number(editRuleBox.getAttribute('data-rule'))].rule = edit;
        })
        this.forceUpdate();
    }

    changeRuleSelect = (event) => {
        event.preventDefault();
        var editRuleBox = event.target.parentElement;
        var edit = event.target.value;
        var editType = editRuleBox.getAttribute('data-type');
        if(edit == "ETC"||edit==""){
            this.setState((state) => {
                state.profile[editType][Number(editRuleBox.getAttribute('data-rule'))].rule_kind = edit;
                state.profile[editType][Number(editRuleBox.getAttribute('data-rule'))].rule_tag = "";
            })
        }else{
            this.setState((state) => {
                state.profile[editType][Number(editRuleBox.getAttribute('data-rule'))].rule_kind = "MasterTags";
                state.profile[editType][Number(editRuleBox.getAttribute('data-rule'))].rule_tag = edit;
            })
        }
        this.forceUpdate();
      }
    getRuleSelect(tags, selectedRule =null){
        var selectedOption = "";
        if(selectedRule != null){
            if(selectedRule.rule_kind =="ETC"){ selectedOption = "ETC";}
            else{ selectedOption = selectedRule.rule_tag;  }
        }
        var ruleSelect = e("select",{className:"form-control is_select2_select",name:"ruleTag", tabIndex:"-1", value:selectedOption, onChange:this.changeRuleSelect},
        e("option",{value:""},"룰을 선택한다"),
        tags.map((tag,index)=>{
            return  e("option",{value:tag._id},tag.tag);
        }),
        e("option",{value:"ETC"},"기타")
        );
        return ruleSelect;
    }

    getRuleBox(rule_id, data,type) {
        var inputBox = null;
        
        if(data.rule_kind == "ETC" ){
            inputBox=e("input", { type: "text", className: "form-control rule_name_search", name: "rule_name_"+rule_id, value: data.rule, onChange: this.changeRule, placeholder: "룰의 명칭" });
        } 
        var rule = e("div", { className: "rule_box", "data-rule": rule_id,"data-type":type, key: rule_id },
            e("button", { type: "button", className: "delete-btn", onClick: this.removeRules }, "X"),
            e("label", { htmlFor: "rule_name" }, "룰"),
            this.getRuleSelect(this.state.masterTagRules, data),
            inputBox,
        );
        return rule;
    }

    getTagName(objId){
        var tag = this.state.masterTagRules.find(tag=>tag._id.equals(objId));
        var name = "";
        if(tag != undefined){
            name = tag.tag;
        }
        return name;
    }

    addScenario = (event) => {
        event.preventDefault();
        var addBox = event.target.parentElement;
        var addType = addBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[addType].push({title:"",author:"",rule:""});
        });
        this.forceUpdate();
    }
    removeScenario = (event) => {
        event.preventDefault();
        var deleteBox = event.target.parentElement; 
        var deleteType = deleteBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[deleteType].splice(deleteBox.getAttribute('data-scenario'), 1);
        });

        this.forceUpdate();
    }

    changeScenario = (event) => {
        event.preventDefault();
        var editBox = event.target.parentElement;
        var editCategory = event.target.getAttribute('data-edit');
        var editValue = event.target.value;
        var editType = editBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[editType][Number(editBox.getAttribute('data-scenario'))][editCategory] = editValue;
        })
        this.forceUpdate();
    }
    getScenarioBox(scenario_id, data,type) {
        var inputBox = null;
        
        if(data.rule_kind == "ETC" ){
            inputBox=e("input", { type: "text", className: "form-control rule_name_search", name: "rule_name_"+scenario_id, value: data.rule, onChange: this.changeRule, placeholder: "룰의 명칭" });
        } 
        var scenario = e("div", { className: "scenario_box", "data-scenario": scenario_id,"data-type":type, key: scenario_id },
            e("button", { type: "button", className: "delete-btn", onClick: this.removeScenario }, "X"),
            e("label", { htmlFor: "rule_name" }, "시나리오"),
            this.getRuleSelect(this.state.masterTagRules, data),
            inputBox,
             e("input", { type: "text", className: "form-control scenario_title_search", name: "scenario_title_"+scenario_id, 'data-edit':'title',value: data.title, onChange: this.changeScenario, placeholder: "시나리오 명칭" }),
            e("input", { type: "text", className: "form-control scenario_author_search", name: "scenario_author_"+scenario_id, 'data-edit':'author',value: data.author, onChange: this.changeScenario, placeholder: "작가" }),
             // e("input", { type: "text", className: "form-control scenario_rule_search", name: "scenario_rule_"+scenario_id, 'data-edit':'rule',value: data.rule, onChange: this.changeScenario, placeholder: "사용된 룰" }),
        );
        return scenario;
    }


    
    addPlayStyle = (event) => {
        event.preventDefault();
        var addBox = event.target.parentElement;
        var addType = addBox.getAttribute('data-type');
        var addCategory = event.target.getAttribute('data-add');
        this.setState((state) => {
            state.profile[addType][addCategory].push("");
        });
        this.forceUpdate();
    }
    removePlayStyle = (event) => {
        event.preventDefault();
        var deleteCategory = event.target.getAttribute('data-edit');
        var deleteBox = event.target.parentElement; 
        var deleteType = deleteBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[deleteType][deleteCategory].splice(deleteBox.getAttribute('data-style'), 1);
        });

        this.forceUpdate();
    }

    changePlayStyle = (event) => {
        event.preventDefault();
        var editBox = event.target.parentElement;
        var editCategory = event.target.getAttribute('data-edit');
        var editValue = event.target.value;
        var editType = editBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[editType][editCategory][Number(editBox.getAttribute('data-style'))] = editValue;
        })
        this.forceUpdate();
    }

    getPlayTypeBox(type_id, data,type) {
        var playType = e("div", { className: "play_style_type_box", "data-style": type_id,"data-type":type, key: type_id },
            e("button", { type: "button", className: "delete-btn",'data-edit':'playTypes', onClick: this.removePlayStyle }, "X"),
            e("label", { htmlFor: "style_type" }, "형태"),
            e("input", { type: "text", className: "form-control style_type_search", name: "style_type_"+type_id, 'data-edit':'playTypes', value: data, onChange: this.changePlayStyle, placeholder: "온라인, 오프라인" }),
        );
        return playType;
    }

    getConditionBox(condition_id, data,type) {
        var condition = e("div", { className: "play_style_condition_box", "data-style": condition_id,"data-type":type, key: condition_id },
            e("button", { type: "button", className: "delete-btn",'data-edit':'canConditions', onClick: this.removePlayStyle }, "X"),
            e("label", { htmlFor: "condition" }, "상황"),
            e("input", { type: "text", className: "form-control style_can_condition_search", name: "condition_"+condition_id, 'data-edit':'canConditions',value: data, onChange: this.changePlayStyle, placeholder: "관전허용, 2차캐릭터 허용 등" }),
        );
        return condition;
    }
    addContact= (event) => {
        event.preventDefault();
        var addBox = event.target.parentElement;
        var addType = addBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[addType].push({type:"",value:""});
        });
        this.forceUpdate();
    }
    removeContact = (event) => {
        event.preventDefault();
        var deleteBox = event.target.parentElement; 
        var deleteType = deleteBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[deleteType].splice(deleteBox.getAttribute('data-contact'), 1);
        });

        this.forceUpdate();
    }

    changeContact = (event) => {
        event.preventDefault();
        var editBox = event.target.parentElement;
        var editCategory = event.target.getAttribute('data-edit');
        var editValue = event.target.value;
        var editType = editBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[editType][Number(editBox.getAttribute('data-contact'))][editCategory] = editValue;
        })
        this.forceUpdate();
    }
    getContactBox(contact_id, data, type){
        var conactSelectBox = e("select",{className:"form-control contact_type_search", name:"contact_type_"+contact_id, value:data.contactType, onChange:this.changeContact,'data-edit':'contactType'},
                                e("option",{value:""},"연락처의 종류 선택"),
                                e("option",{value:"twitter"},"트위터"),
                                e("option",{value:"email"},"이메일"),
                                e("option",{value:"kakaotalk"},"카카오톡ID"),
                                e("option",{value:"telegram"},"텔레그램 채널"),
                                e("option",{value:"instagram"},"인스타그램"),
                                // e("option",{value:""},"연락처의 종류 선택"),
                                
                                );
        var contact = e("div",{className:"contact_box", "data-contact":contact_id, "data-type":type, key: contact_id},
        e("button",{type:"button", className:"delete-btn", 'data-edit':'contacts', onClick:this.removeContact},"X"),
        e("label",{htmlFor:"contact_type"},"연락처"),
        conactSelectBox,
        // e("input",{type:"text",className:"form-control contact_type_search", name:"contact_type_"+contact_id,'data-edit':'contactType',value: data.contactType, onChange:this.changeContact , placeholder: "연락처 종류(트위터,카카오톡 오픈채팅방주소 등)" }),     
        e("input",{type:"text",className:"form-control contact_value_search", name:"contact_value_"+contact_id,'data-edit':'contact',value: data.contact, onChange:this.changeContact , placeholder: "종류에 맞는 연락처를 적어주세요" })
        );
        return contact;
    }
    addMaterial = (event) => {
        event.preventDefault();
        var addBox = event.target.parentElement;
        var addType = addBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[addType].push("");
        });
        this.forceUpdate();
    }
    removeMaterial = (event) => {
        event.preventDefault();
        var deleteBox = event.target.parentElement; 
        var deleteType = deleteBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[deleteType].splice(deleteBox.getAttribute('data-material'), 1);
        });

        this.forceUpdate();
    }

    changeMaterial = (event) => {
        event.preventDefault();
        var editBox = event.target.parentElement;
        var editValue = event.target.value;
        var editType = editBox.getAttribute('data-type');
        this.setState((state) => {
            state.profile[editType][Number(editBox.getAttribute('data-material'))]= editValue;
        })
        this.forceUpdate();
    }
    getMaterialBox(material_id, data, type){
        var material = e("div",{className:"material_box", "data-material":material_id, "data-type":type, key: material_id},
        e("button",{type:"button", className:"delete-btn", 'data-edit':'material', onClick:this.removeMaterial},"X"),
        e("label",{htmlFor:"material"},"소재"),
       e("input",{type:"text",className:"form-control material_value_search", name:"material_value_"+material_id,'data-edit':'material',value: data, onChange:this.changeMaterial , placeholder: "소재 단어를 적어주세요" })
        );
        return material;
    }
    render() {

        //연락처 - 클리어
        //선호스타일-온라인(보이스, 텍스트), 오프라인, 관전허용, 2차캐릭터 허용, 초면가능, 타세션PC허용 - 클리어?
        //선호룰 - 클리어
        //마스터링 가능룰 - 클리어
        //가진 룰북 - 룰, 언어, 서플리먼트(이름, 언어) - 클리어
        //다녀온 시나리오-타이틀, 작가, 룰 - 클리어
        //마스터가능 시나리오 - 타이틀, 작가, 룰 - 클리어
        //
        var component = <div></div>;
        if(this.state.profile!=undefined){
            component = e("div", {className:"form-group"},
            e("input", { type: "hidden", name: "data_profile" }),
            e("div", {className:"form-group"}, 
            e("div", { className: "contact_container", id:"contacts_container",'data-type':'contacts'},
                    e("span",null,"연락처"),
                    e("button", { type: "button", className: "add_contact", onClick: this.addContact }, "연락처 추가"),
                    this.state.profile.contacts.map((value, index) => {
                        return this.getContactBox(index, value, "contacts")
                    })
            ),
            e("div", { className: "rule_container", id:"have_rules_container",'data-type':'haveRules'},
                    e("span",null,"가지고 있는 룰들"),
                    e("button", { type: "button", className: "add_rule", onClick: this.addHaveRules }, "가진 룰 추가"),
                    this.state.profile.haveRules.map((value, index) => {
                        return this.getRuleBox(index, value,'haveRules')
                    })
            ),
            e("div", { className: "rule_container", id:"prefer_rules_container"},
                    e("span",null,"선호하는 룰"),
                    e("button", { type: "button", className: "add_rule", onClick: this.addPreferRules }, "선호하는 룰 추가"),
                    this.state.profile.preferRules.map((value, index) => {
                        return this.getRuleBox(index, value,'preferRules')
                    })
            ),
            e("div", { className: "rule_container", id:"can_master_rules_container"},
                    e("span",null,"마스터링 가능 룰"),
                    e("button", { type: "button", className: "add_rule", onClick: this.addCanMasterRules }, "마스터 가능 룰 추가"),
                    this.state.profile.canMasterRules.map((value, index) => {
                        return this.getRuleBox(index, value,'canMasterRules')
                    })
            ),  
            e("div", { className: "scenario_container", id:"went_to_scenarios_container",'data-type':'wentToScenarios'},
                    e("span",null,"다녀온 시나리오"),
                    e("button", { type: "button", className: "add_scenario", onClick: this.addScenario}, "다녀온 시나리오 추가"),
                    this.state.profile.wentToScenarios.map((value, index) => {
                        return this.getScenarioBox(index, value,'wentToScenarios')
                    })
            ),
            e("div", { className: "scenario_container", id:"can_master_scenarios_container",'data-type':'canMasterScenarios'},
                    e("span",null,"마스터링 가능 시나리오"),
                    e("button", { type: "button", className: "add_scenario", onClick: this.addScenario}, "마스터링 가능 시나리오 추가"),
                    this.state.profile.canMasterScenarios.map((value, index) => {
                        return this.getScenarioBox(index, value,'canMasterScenarios')
                    })
            ),
            e("div", { className: "play_style_container", id:"prefer_play_style_container",'data-type':'preferPlayStyle'},
                    e("span",null,"선호하는 플레이 스타일"),
                    e("button", { type: "button", className: "add_play_style", 'data-add':'playTypes',onClick: this.addPlayStyle}, "플레이 형태 추가"),
                    e("button", { type: "button", className: "add_play_style", 'data-add':'canConditions',onClick: this.addPlayStyle}, "플레이 상태 추가"),
                    this.state.profile.preferPlayStyle.playTypes.map((value, index) => {
                        return this.getPlayTypeBox(index, value,'preferPlayStyle')
                    }),
                   this.state.profile.preferPlayStyle.canConditions.map((value, index) => {
                        return this.getConditionBox(index, value,'preferPlayStyle')
                    })
            ),         
            e("div", { className: "material_container", id:"ng_material_container",'data-type':'ngMaterials'},
                    e("span",null,"NG 소재"),
                    e("button", { type: "button", className: "add_material_style", 'data-add':'material',onClick: this.addMaterial}, "소재 추가"),

                    this.state.profile.ngMaterials.map((value, index) => {
                        return this.getMaterialBox(index, value,'ngMaterials')
                    }),
            ),        
            )
        );
        }
        
        return component;
    }
}

export default UserProfile;
// ReactDOM.render(e(UserProfile), document.querySelector('.editContainer'));
