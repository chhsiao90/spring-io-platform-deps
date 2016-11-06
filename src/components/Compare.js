import React, {Component} from 'react';
import {DataTable, TableHeader} from 'react-mdl';

export default class Compare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diffTable: [],
        };
    }

    componentWillMount() {
        const {base, diff} = this.props.location.query;
        if (base && diff) {
            this.updateDiffTable(base, diff);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {prevBase, prevDiff} = this.props.location.query;
        const {base, diff} = nextProps.location.query;
        if (base && diff && (prevBase != base || prevDiff != diff)) {
            this.updateDiffTable(base, diff);
        }
    }

    updateDiffTable(base, diff) {
        var baseDepsPromise = fetch(`./history/platform-bom-${base}.properties`)
            .then(response => response.text());
        var diffDepsPromise = fetch(`./history/platform-bom-${diff}.properties`)
            .then(response => response.text());
        Promise.all([baseDepsPromise, diffDepsPromise]).then(values => {
            const [baseDeps, diffDeps] = values;
            this.setState({
                diffTable: compare(baseDeps, diffDeps),
            });
        });
    }

    render() {
        const {base, diff} = this.props.location.query;
        if (base && diff && this.state.diffTable.length) {
            return (
                <DataTable
                    rows={this.state.diffTable}>
                    <TableHeader name='groupId'>Group</TableHeader>
                    <TableHeader name='artifactId'>Artifact</TableHeader>
                    <TableHeader name='baseVersion'>{base} Version</TableHeader>
                    <TableHeader name='diffVersion'>{diff} Version</TableHeader>
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

const compare = function(base, diff) {
    const keyOf = entry => `${entry.groupId}:${entry.artifactId}`;
    const baseTable = parse(base);
    const diffTable = parse(diff);
    var compareTable = new Map();
    baseTable.forEach(entry => {
        compareTable.set(keyOf(entry), {
            groupId: entry.groupId,
            artifactId: entry.artifactId,
            baseVersion: entry.version,
            stat: 'Delete',
        });
    });
    diffTable.forEach(entry => {
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
