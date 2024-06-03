import mongoose from "mongoose";



const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};

export const productSchema = new mongoose.Schema({
    title: stringTypeSchemaUniqueRequired,
    description: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: [
            'computadoras',
            'telefonos',
            'televisores',
            'accesorios',
            'electrodomésticos'
        ],
        required: true,
        index: true
    },
    thumbnails: {
        type: [],
        default: []
    }
})
productSchema.set('toJSON',{
    virtuals:true,
    versionKey: false,
    transform: function(doc, ret, options) {
        delete ret._id
    },
  })
  
export const productModel = mongoose.model('products', productSchema)