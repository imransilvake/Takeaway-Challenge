// react
import React, { Component } from 'react';

// firebase
import firebase from '../../../firebase';
import formatMessageTime from '../../utilities/Date';
import i18n from '../../../assets/i18n/i18n';
import Loading from '../../components/Loading';

class Logs extends Component {
	state = {
		gameLogsRef: firebase.database().ref('logs'),
		isLoadFinished: false,
		logs: []
	};

	componentDidMount() {
		const { gameLogsRef } = this.state;

		// fetch logs
		gameLogsRef
			.orderByChild('timestamp')
			.on('value', (snaps) => {
				if (snaps.exists()) {
					const logs = [];
					snaps.forEach((child) => {
						logs.push(child.val());
					});

					// set state
					this.setState({ logs: logs.reverse() });
				}

				// set state
				this.setState({ isLoadFinished: true });
			});
	}

	componentWillUnmount() {
		const { gameLogsRef } = this.state;

		// remove logs listener
		gameLogsRef.off();
	}

	render() {
		const { logs, isLoadFinished } = this.state;

		return !isLoadFinished ? <Loading/> : (
			<section className="tc-logs tc-view-height">
				{
					logs && !logs.length && (
						<h5 className="ts-empty tc-view-height">
							{isLoadFinished && i18n.t('LOGS.EMPTY')}
						</h5>
					)
				}
				{
					logs && logs.length && (
						<React.Fragment>
							<h5 className="tc-title">{i18n.t('LOGS.TITLE', { value: logs.length })}</h5>
							<div className="tc-list">
								{
									logs.map((log, i) => (
										<article key={i} className="tc-log">
											<h6>{i18n.t('LOGS.RESULT.ID', { value: logs.length - i })}</h6>
											<p><span>{i18n.t('LOGS.RESULT.MODE')}</span> {log.mode}</p>
											<p><span>{i18n.t('LOGS.RESULT.STATUS')}</span> {log.status}</p>
											<p><span>{i18n.t('LOGS.RESULT.WINNER')}</span> {log.winner}</p>
											<p>
												<span>{i18n.t('LOGS.RESULT.DATE')} </span>
												{formatMessageTime(log.timestamp, 'MMMM Do YYYY, h:mm:ss')}
											</p>
										</article>
									))
								}
							</div>
						</React.Fragment>
					)
				}
			</section>
		);
	}
}

export default Logs;
