import React, {Component} from 'react';
import {DataTable, TableHeader} from 'react-mdl';

export default class Compare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: this.props.location.query.first,
            second: this.props.location.query.second,
            diffTable: [],
        };
    }

    componentDidMount() {
        const {first, second} = this.props.location.query;
        if (first && second) {
            var fetchFirst = fetch(`./history/platform-bom-${first}.properties`)
                .then(response => response.text());
            var fetchSecond = fetch(`./history/platform-bom-${second}.properties`)
                .then(response => response.text());
            Promise.all([fetchFirst, fetchSecond]).then(values => {
                this.setState({
                    diffTable: compare(values[0], values[1]),
                });
            });
        }
    }

    render() {
        const {first, second} = this.props.location.query;
        if (first && second && this.state.diffTable.length) {
            return (
                <DataTable
                    rows={this.state.diffTable}>
                    <TableHeader name='groupId'>Group</TableHeader>
                    <TableHeader name='artifactId'>Artifact</TableHeader>
                    <TableHeader name='baseVersion'>{first} Version</TableHeader>
                    <TableHeader name='diffVersion'>{second} Version</TableHeader>
                </DataTable>
            );
        }
        else {
            return (
                <div />
            )
        };
    }
}

const compare = function(first, second) {
    const keyOf = entry => `${entry.groupId}:${entry.artifactId}`;
    const firstTable = parse(first);
    const secondTable = parse(second);
    var compareTable = new Map();
    firstTable.forEach(entry => {
        compareTable.set(keyOf(entry), {
            groupId: entry.groupId,
            artifactId: entry.artifactId,
            baseVersion: entry.version,
            stat: 'Delete',
        });
    });
    secondTable.forEach(entry => {
        const key = keyOf(entry);
        if (compareTable.has(key)) {
            compareTable.get(key).diffVersion = entry.version;
            compareTable.get(key).stat = 
                compareTable.get(key).baseVersion == entry.version
                    ? 'Same'
                    : 'Update';
        }
        else {
            compareTable.set(key, {
                groupId: entry.groupId,
                artifactId: entry.artifactId,
                baseVersion: entry.version,
                stat: 'New',
            });
        }
    });
    return Array.from(compareTable.values());
}

const parse = function(versionTable) {
    return versionTable
        .split('\n')
        .map(text => /(.+)\\:(.+)=(.+)/g.exec(text))
        .filter(matcher => matcher)
        .map(matcher => {
            return {
                groupId: matcher[1],
                artifactId: matcher[2],
                version: matcher[3],
            };
        });
}
