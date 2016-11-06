import {List} from 'immutable';
import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button, Grid, Cell} from 'react-mdl';

import Versions from './Versions';
import Select from './Select';

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            versions: List.of(),
            selected: List.of(),
        };
    }

    componentDidMount() {
        fetch('./versions.json')
            .then(response => response.json())
            .then(versions => {
                this.setState({
                    versions: List(versions)
                });
            });
    }

    selectVersion(e, version) {
        if (this.state.selected.size < 2) {
            this.setState({
                selected: this.state.selected.push(version)
            });
        }
    }

    unselectVersion(e, version) {
        const index = this.state.selected.indexOf(version);
        this.setState({
            selected: this.state.selected.delete(index)
        });
    }

    render() {
        const unselect = this.state.versions.filter(
            version => !this.state.selected.includes(version));
        return (
            <div>
                <h2>Spring IO Dependencies Compare Table</h2>
                <Grid>
                    <Cell col={2}>
                        <Versions
                            versions={unselect}
                            selectVersion={this.selectVersion.bind(this)}
                        />
                    </Cell>
                    <Cell col={2}>
                        <Select
                            selected={this.state.selected}
                            unselectVersion={this.unselectVersion.bind(this)}
                        />
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={2}>
                        <Link to={{
                            pathname: '/compare',
                            query: {
                                first: this.state.selected.get(0),
                                second: this.state.selected.get(1),
                            }}}>
                            <Button raised>Compare</Button>
                        </Link>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        {this.props.children}
                    </Cell>
                </Grid>
            </div>
        )
    }
}
