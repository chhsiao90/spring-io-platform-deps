import React, {Component} from 'react';
import {List, ListItem, Chip} from 'react-mdl';

export default class Versions extends Component {
    render() {
        const { versions, selectVersion } = this.props;

        return (
            <List>
                <ListItem
                    style={{
                        padding: 4,
                    }}>
                    Available Versions
                </ListItem>
                {versions.map(version => (
                    <ListItem
                        style={{
                            padding: 4,
                        }}
                        key={version}>
                        <Chip
                            onClick={(e) => selectVersion(e, version)}>
                            {version}
                        </Chip>
                    </ListItem>
                ))}
            </List>
        );
    }
}
