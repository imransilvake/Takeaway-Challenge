// react
import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <section className="tc-header">
                <div className="cd-row">
                    <div className="cd-col cd-col-pm-t-6">
                        <h5>Takeaway</h5>
                    </div>
                    <div className="cd-col cd-col-pm-t-6 cd-right-align">
                        <a href="#">EN</a>
                        <span> / </span>
                        <a href="#">DE</a>
                    </div>
                </div>
            </section>
        );
    }
}

export default Header;
