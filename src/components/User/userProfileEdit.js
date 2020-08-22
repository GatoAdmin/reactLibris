import React from 'react';
import axios from 'axios';
import { Button,Input, Form } from 'semantic-ui-react'
import { Link} from 'react-router-dom';
import ProfilePart from './userProfileEditPart';

const e = React.createElement;
class UserProfile extends React.Component { 
constructor(props) {
    super(props);
    this.state = {
        currentUser: props.currentUser
    };
}
    componentDidMount() {
        let getProfile = () => {
            axios.post(window.location.href)
                .then(res => {
                    this.setState({
                        profile: res.data.profile,
                        masterTagRules :res.data.masterTagRules,
                    });
                    //    setTimeout(getArticles, 1000 * 10); // REPEAT THIS EVERy 10 SECONDS
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
        getProfile();
    }

     convertData(){
        var data_contacts = this.getContacts();
        var data_have_rules =  this.getHaveRules();
        var data_prefer_rules =  this.getPreferRules();
        var data_can_master_rules =  this.getCanMasterRules();
        var data_can_master_scenarios =   this.getCanMasterScenarios();
        var data_went_to_scenarios =  this.getWentToScenarios();
        var data_prefer_style =  this.getPreferPlayStyles();
        var data_ng_materials =  this.getNGMaterials();
    
        var profile = document.querySelector('input[name=data_profile]');
        var data_profile = {
            contacts: data_contacts,
            haveRules : data_have_rules,
            preferRules : data_prefer_rules,
            canMasterRules : data_can_master_rules,
            wentToScenarios:data_went_to_scenarios,
            canMasterScenarios : data_can_master_scenarios,
            preferPlayStyle : data_prefer_style,
            ngMaterials :data_ng_materials,
        }
        profile.value = JSON.stringify(data_profile);
        return true;
      };
    
       getHaveRules(){
        var data_rules = [];
        var rules = document.querySelector('#have_rules_container').querySelectorAll('.rule_box');
        
        for(var i=0; i<rules.length;i++)
        {
            var selectRule = rules[i].querySelector('[name=ruleTag]')
            if(selectRule.value == "ETC"){
                var rule_title= rules[i].querySelector('input.rule_name_search');
                if(rule_title.value != ''&& rule_title.value != null){
                    data_rules.push({rule:rule_title.value,rule_kind:"ETC"});    
                }
            }else if(selectRule.value !=""){
                data_rules.push({rule_tag:selectRule.value,rule_kind:"MasterTag"});  
            }
            
        }
    
        return data_rules;
      }
    //    getHaveRules(){
    //     var data_rules = [];
    //     var rules = document.querySelector('#have_rules_container').querySelectorAll('.rule_box');
        
    //     for(var i=0; i<rules.length;i++)
    //     {
    //         var rule_title= rules[i].querySelector('input.rule_name_search');
    //         // var rule_language= rules[i].querySelector('input.rule_language_search');
    //         if(rule_title.value != ''&& rule_title.value != null){
    //             // var data_supplements = [];
    //             // var supplements= rules[i].querySelectorAll('.supplement_container .supplement_box');
    //             // for(var j=0; j<supplements.length;j++){
    //             //     var supplement_title = supplements[j].querySelector('input[name=supplement_title_'+i+'_'+j+']');
    //             //     var supplement_language = supplements[j].querySelector('input[name=supplement_language_'+i+'_'+j+']');
    //             //     if(supplement_title.value != ''&& supplement_title.value != null){
    //             //         data_supplements.push({title:supplement_title.value,language:supplement_language.value });           
    //             //     }
    //             // }
    //             data_rules.push({title:rule_title.value, /*language :rule_language.value, supplements:data_supplements*/});
    //         }
    //     }
    
    //     return data_rules;
    //   }
    
       getPreferRules(){
        var data_rules = [];
        var rules = document.querySelector('#prefer_rules_container').querySelectorAll('.rule_box');
        
        for(var i=0; i<rules.length;i++)
        {
            var selectRule = rules[i].querySelector('[name=ruleTag]')
            if(selectRule.value == "ETC"){
                var rule_title= rules[i].querySelector('input.rule_name_search');
                if(rule_title.value != ''&& rule_title.value != null){
                    data_rules.push({rule:rule_title.value,rule_kind:"ETC"});    
                }
            }else if(selectRule.value !=""){
                data_rules.push({rule_tag:selectRule.value,rule_kind:"MasterTag"});  
            }
            
        }
    
        return data_rules;
      }
    /*
        preferRules: [{ 
            rule: { type: String },
            rule_tag:{ type: Schema.Types.ObjectId},
            rule_kind : { type:String, required:true, enum: [ 'MasterTag','ETC'] },
        }], //선호룰
    */
       getCanMasterRules(){
        var data_rules = [];
        var rules = document.querySelector('#can_master_rules_container').querySelectorAll('.rule_box');
        
        for(var i=0; i<rules.length;i++)
        {
            var selectRule = rules[i].querySelector('.is_select2_select')
            if(selectRule.value == "ETC"){
                var rule_title= rules[i].querySelector('input.rule_name_search');
                if(rule_title.value != ''&& rule_title.value != null){
                    data_rules.push({rule:rule_title.value,rule_kind:"ETC"});    
                }
            }else if(selectRule.value !=""){
                data_rules.push({rule_tag:selectRule.value,rule_kind:"MasterTag"});  
            }
        }
    
        return data_rules;
      }
       getCanMasterScenarios(){
        var data_scenarios = [];
        var scenarios = document.querySelector('#can_master_scenarios_container').querySelectorAll('.scenario_box');
        
        for(var i=0; i<scenarios.length;i++)
        {
            var selectRule= scenarios[i].querySelector('[name=ruleTag]');
            var title= scenarios[i].querySelector('input.scenario_title_search');
            var author= scenarios[i].querySelector('input.scenario_author_search');
    
            if(selectRule.value == "ETC"){
                if(title.value != ''&& title.value != null){
                    data_scenarios.push({title: title.value, author:author.value, rule:selectRule.value,rule_kind:"ETC"});    
                }
            }else if(selectRule.value !=""){
                data_scenarios.push({title: title.value, author:author.value, rule_tag:selectRule.value,rule_kind:"MasterTag"});  
            }
        }
        
        return data_scenarios;
        }
    
       getWentToScenarios(){
        var data_scenarios = [];
        var scenarios = document.querySelector('#went_to_scenarios_container').querySelectorAll('.scenario_box');
        
        for(var i=0; i<scenarios.length;i++)
        {        
            var selectRule= scenarios[i].querySelector('[name=ruleTag]');
            var title= scenarios[i].querySelector('input.scenario_title_search');
            var author= scenarios[i].querySelector('input.scenario_author_search');
    
            if(selectRule.value == "ETC"){
                if(title.value != ''&& title.value != null){
                    data_scenarios.push({title: title.value, author:author.value, rule:selectRule.value,rule_kind:"ETC"});    
                }
            }else if(selectRule.value !=""){
                data_scenarios.push({title: title.value, author:author.value, rule_tag:selectRule.value,rule_kind:"MasterTag"});  
            }
            // var title= scenarios[i].querySelector('input.scenario_title_search');
            // var rule= scenarios[i].querySelector('input.scenario_rule_search');
            // var author= scenarios[i].querySelector('input.scenario_author_search');
    
            // if(title.value != ''&& title.value != null){
            //     data_scenarios.push({title: title.value, author:author.value,rule:rule.value});    
            // }
        }
    
        return data_scenarios;
      }
    
       getPreferPlayStyles(){
        var data_types = [];
        var data_conditions = [];
        var playTypes = document.querySelector('#prefer_play_style_container').querySelectorAll('.play_style_type_box');
        var canConditions = document.querySelector('#prefer_play_style_container').querySelectorAll('.play_style_condition_box');
        for(var i=0; i<playTypes.length;i++)
        {
            var type= playTypes[i].querySelector('input.style_type_search');
            if(type.value != ''&& type.value != null){
                playTypes.push(type.value);    
            }
        }
        for(var j=0; i<canConditions.length;j++)
        {
            var condition= canConditions[j].querySelector('input.style_can_condition_search');
            if(condition.value != ''&& condition.value != null){
                canConditions.push(condition.value);    
            }
        }
    
        var data_prefer_style = {playTypes:data_types, canConditions:data_conditions};
        return data_prefer_style;
      }
    
       getContacts(){
        var data_contacts = [];
        var contacts = document.querySelector('#contacts_container').querySelectorAll('.contact_box');
        for(var i=0; i<contacts.length;i++)
        {       
            var contactType = contacts[i].querySelector('.contact_type_search');
            var contact = contacts[i].querySelector('input.contact_value_search'); 
            if(contactType.value != ''&& contactType.value != null){
                data_contacts.push({contactType: contactType.value, contact:contact.value });    
            }
        }
        return data_contacts;
      }
    
    getNGMaterials(){
        var data_materials = [];
        var materials = document.querySelector('#ng_material_container').querySelectorAll('.material_box');
        
        for(var i=0; i<materials.length;i++)
        {
            var material = materials[i].querySelector('input.material_value_search'); 
            if(material.value != ''&& material.value != null){
                data_materials.push(material.value);
            }
        }
    
        return data_materials;
      }
    render() {
        var component = <div></div>;
        console.log("");
        if(this.state.currentUser!=null&&typeof(this.state.currentUser) == 'object'&&!Array.isArray(this.state.currentUser)){
            component = (<div>
                <div id="form-container" className="container">
                    <form method="POST" action={`/user/${this.state.currentUser.userName}/save`} onSubmit={()=>this.convertData()}>
                        {this.state.profile!=undefined?<ProfilePart masterTagRules={this.state.masterTagRules} profile={this.state.profile}{...this.props}/>:null}

                        <Button className="btn btn-primary" type="submit">수정</Button>
                        <Button className="btn btn-primary" as={Link} to={`/user/${this.state.currentUser.userName}`}>취소</Button>
                    </form>
                </div>
        </div>);
        }
        return component;
    }
}

export default UserProfile;
// ReactDOM.render(e(UserProfile), document.querySelector('.editContainer'));
