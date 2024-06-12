import React from 'react';

const MyMessage : React.FC<{text: string, username: string}> = ({text, username}) => {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
        <div className="text-sm">{text}</div>
      </div>
    </div>
  );
};

export default MyMessage;