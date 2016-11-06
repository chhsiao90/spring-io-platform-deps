import React, { Component } from 'react';
import {List, ListItem, Chip} from 'react-mdl';

export default class Select extends Component {
    render() {
        const makeItem = (version, unselectVersion) => (
            <Chip
                onClick={(e) => unselectVersion(e, version)}>
                {version}
            </Chip>
        );

        const {unselectVersion} = this.props;
        const [first, second] = this.props.selected
            .map(version => makeItem(version, unselectVersion));
        return (
            <List>
                <ListItem style={{
                    padding: 4,
                }}>
                    Base Version
                </ListItem>
                <ListItem style={{
                    padding: 4,
                }}>
                    {first}
                </ListItem>
                <ListItem style={{
                    padding: 4,
                }}>
                    Diff Version
                </ListItem>
                <ListItem style={{
                    padding: 4,
                }}>
                    {second}
                </ListItem>
            </List>
        );
    }
}
