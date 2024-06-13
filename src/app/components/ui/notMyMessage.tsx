import React from 'react';

interface NotMyMessageProps {
    text: string;
    username: string;
}

const NotMyMessage : React.FC<NotMyMessageProps>  = ({ text, username }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%] break-words">
        <div className="font-medium">{username}</div>
        <div className="text-sm">{text}</div>
      </div>
    </div>
  );
};

export default NotMyMessage;