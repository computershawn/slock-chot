import React from 'react';

//export default class SideBar extends Component {
export default function SideBar(props) {
  return (
    <div className="sidebar-wrapper">
      <h4>users online</h4>
      <ul>
        <li><div className="people-list-item">{props.mySelf.userName} ◆</div></li>
        {
          props.usersPresent.map((item, index) => <li key={index}><div className="people-list-item">{item}</div></li>)
        }
      </ul>
    </div>
  );
}