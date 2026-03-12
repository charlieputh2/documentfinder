import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    documentType: {
      type: DataTypes.ENUM('MN', 'MI', 'QI', 'QAN', 'VA', 'PCA', 'manufacturing', 'quality'),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    version: {
      type: DataTypes.STRING(12),
      defaultValue: '1.0.0'
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    filePublicId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileType: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    textContent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    indexes: [
      { fields: ['title'] },
      { fields: ['category'] },
      { fields: ['documentType'] },
      { fields: ['createdBy'] },
      { fields: ['isActive'] }
    ]
  });

  return Document;
};
