import React from "react";

const HeadToHead = ({ headToHeadData, isFirst }) => {
  const first_user = isFirst ? headToHeadData.user1 : headToHeadData.user2;
  const second_user = isFirst ? headToHeadData.user2 : headToHeadData.user1;

  return (
    <div className='bg-[#93A87E] text-[#313036] p-6 rounded-lg shadow-lg w-full max-w-md my-6 border-2 border-[#313036] font-SIL text-3xl'>
      <div className='flex justify-between items-center mb-4'>
        <div className='text-center'>
          <h3 className=' '>{first_user.name}</h3>
          <p className=''>{first_user.score}</p>
        </div>
        <span className=''>vs</span>
        <div className='text-center'>
          <h3 className=' '>{second_user.name}</h3>
          <p className=''>{second_user.score}</p>
        </div>
      </div>
      <p className='text-center'>{headToHeadData.message}</p>
    </div>
  );
};

export default HeadToHead;
