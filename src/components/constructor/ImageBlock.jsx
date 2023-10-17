import React from 'react';

const ImageBlock = (props) => {
  const { contentState, block } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src } = entity.getData();
  
  return (
    <div className="image-block">
      <img src={src} alt="Изображение" />
    </div>
  );
};

export default ImageBlock;
