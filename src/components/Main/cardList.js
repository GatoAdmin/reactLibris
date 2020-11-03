import React from 'react';
import { Button, Card, Image, Icon } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import { Component } from 'react';

const src = 'https://react.semantic-ui.com/images/wireframe/image.png'
class CradList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            name:props.name,
            type:props.type,
            cards: props.cards
        };
    }
    render() {
        var component = <div className="card-list" ></div>;
        if(this.state.cards.length>4){
            component = <div className="card-list" >
                <div className="inline-flex"><h3>{this.state.name}</h3>
                <Button className="shadow-none btn" size="tiny" basic as={Link} to={`/${this.state.type}`}>더보기<Icon name="arrow right"/></Button></div>
                {/* <div style={{overflowX:'hidden',height:'330px',overflowY:'hidden'}}> */}
                        <Card.Group stackable={true} doubling={true} centered={false} itemsPerRow={5}>
                            {this.state.cards.map((card, index)=>{
                                return (<Card key={index} href={`/${this.state.type}/view/${card._id}`}>
                                    <Image src={card.banner!=undefined&&card.banner.length>0?"/assets/images/"+card.banner[0].imageData:src} wrapped ui={false} />
                                    <Card.Content>
                                        <Card.Header>{card.title}</Card.Header>
                                        <Card.Meta>{card.author.userName}</Card.Meta>
                                    </Card.Content>
                                    {/* <Card.Content extra>
                                            <Icon name='eye' />
                                            {card.view}
                                    </Card.Content> */}
                                </Card>);
                            })}
                        </Card.Group>
                    {/* </div> */}
            </div>;
        }else if(this.state.cards.length>0){
            component = <div className="card-list" >
                <div>
                <div className="inline-flex"><h3>{this.state.name}</h3>
                <Button className="shadow-none btn" size="tiny" basic as={Link} to={`/${this.state.type}`}>더보기<Icon name="arrow right"/></Button></div>
                        <Card.Group stackable={true} doubling={true} centered={true}>
                            {this.state.cards.map((card, index)=>{
                                console.log(card);
                                return (<Card key={index} href={`/${this.state.type}/view/${card._id}`}>
                                    <Image src={card.banner!=undefined&&card.banner.length>0?"/assets/images/"+card.banner[0].imageData:src} wrapped ui={false} />
                                    <Card.Content>
                                        <Card.Header>{card.title}</Card.Header>
                                        <Card.Meta>{card.author.userName}</Card.Meta>
                                    </Card.Content>
                                    {/* <Card.Content extra>
                                            <Icon name='eye' />
                                            {card.view}
                                    </Card.Content> */}
                                </Card>);
                            })}
                        </Card.Group>
                    </div>
            </div>;
        }
        return component;
    }
}
export default CradList;
