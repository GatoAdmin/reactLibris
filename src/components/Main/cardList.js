import React from 'react';
import { Button, Card, Image, Icon } from 'semantic-ui-react';

const src = 'https://react.semantic-ui.com/images/wireframe/image.png'
class CradList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type:props.type,
            cards: props.cards
        };
    }
    render() {
        return (
            <div className="card-list">
                <Card.Group>
                    {this.state.cards.map((card, index)=>{
                        return (<Card key={index} href={`/${this.state.type}/view/${card._id}`}>
                            <Image src={card.banner!=undefined?card.banner:src} wrapped ui={false} />
                            <Card.Content>
                                <Card.Header>{card.lastVersion.title}</Card.Header>
                                <Card.Meta>{card.author.userName}</Card.Meta>
                                <Card.Description>
                                    {card.lastVersion.content}
                                </Card.Description>
                                
                            </Card.Content>
                            <Card.Content extra>
                                    <Icon name='eye' />
                                    {card.view}
                            </Card.Content>
                        </Card>);
                    })}
                </Card.Group>
                <Button></Button>
            </div>
        );
    }
}
export default CradList;
