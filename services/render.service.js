

//import * as ejs from 'ejs';

const ejs = require('ejs');

//import { readFile as _readFile } from 'fs';
const fs = require('fs');
//const fsExists = util.promisify(fs.exists)
//const fsMkdir = util.promisify(fs.mkdir)


//import { promisify } from 'util';
const util = require('util');

const readFile = util.promisify(fs.readFile);

exports.editProduct = async function(data)
{
    const template = await readFile('/home/rom/projects/walter/cryptibuyejs/ShoppingCart/views/api/edit-product.ejs', 'utf-8');
    //const employeeDetails = await readFile(/* your json file */, 'utf-8');
    const html = ejs.render(template, data)
    console.log(`23: html= ${JSON.stringify(html,null,4)}`)
    return html

}
exports.editProduct2 = async function(data)
{
    
    let product = data.product
    let options = '<option value="">--Select--</option>'

    for(cat of data.categories) { 
        
        options = `${options}<option ${cat.id == product.categoryId ? 'selected' : ''}  value="${cat.id}">${cat.name}</option>`
        
        
    }
    let html = 
`<!-- Container-fluid starts-->
<div class="container-fluid">
    <div class="row">
        <div class="col-sm-12">
            <div class="card">
                <div class="card-body">
                    <div class="row product-adding">
                        <div class="col-xl-5">
                            <div class="add-product">
                                <div class="row">
                                    <div class="col-xl-9 xl-50 col-sm-6 col-9">
                                        <img src="${product.upload1}" alt=""
                                            class="img-fluid image_zoom_1 blur-up lazyloaded">
                                    </div>
                                    <div class="col-xl-3 xl-50 col-sm-6 col-3">
                                        <form id="uploadform" action="/vendor/upload" method="post" enctype="multipart/form-data">
                                            <input type="hidden" name="uploadkey" id="uploadkey" value=""/>
                                            
                                            <input type="hidden"  name="prodguid" value="${product.guid}"/>
                                        <ul class="file-upload-product">
                                            <li>
                                                <div class="box-input-file"><input id="upload1" class="upload" name ="upload"
                                                        type="file"><i class="fa fa-plus"></i></div>
                                            </li>
                                            <li>
                                                <div class="box-input-file"><input id="upload2" class="upload" name ="upload"
                                                        type="file"><i class="fa fa-plus"></i></div>
                                            </li>
                                            <li>
                                                <div class="box-input-file"><input id="upload3" class="upload" name ="upload"
                                                        type="file"><i class="fa fa-plus"></i></div>
                                            </li>
                                            <li>
                                                <div class="box-input-file"><input id="upload4" class="upload" name ="upload"
                                                        type="file"><i class="fa fa-plus"></i></div>
                                            </li>
                                            <li>
                                                <div class="box-input-file"><input id="upload5" class="upload" name ="upload"
                                                        type="file"><i class="fa fa-plus"></i></div>
                                            </li>
                                            <li>
                                                <div class="box-input-file"><input id="upload6" class="upload" name ="upload"
                                                        type="file"><i class="fa fa-plus"></i></div>
                                            </li>
                                        </ul>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-7">
                            <form class="needs-validation add-product-form" action="/vendor/edit-product" method="post" novalidate="">
                                <input type="hidden"  name="guid" value="${product.guid}"/>
                                
                                
                                <div class="form">
                                    <div class="form-group mb-3 row">
                                        <label for="validationCustom01"
                                            class="col-xl-3 col-sm-4 mb-0">Title :</label>
                                        <div class="col-xl-8 col-sm-7">
                                            <input class="form-control" id="validationCustom01" name="name"
                                                type="text" value="${product.name}" required="">
                                        </div>
                                        <div class="valid-feedback">Looks good!</div>
                                    </div>
                                    <div class="form-group mb-3 row">
                                        <label for="validationCustom01"
                                            class="col-xl-3 col-sm-4 mb-0">Category :</label>
                                            <div class="col-xl-8 col-sm-7">
                                                <select name="categoryId" class="custom-select form-control" required="">
                                                    <option value="">--Select--</option>
                                                    ${options}
                                                </select>
                                            </div>
                                    </div>
                                    <div class="form-group mb-3 row">
                                        <label for="validationCustom02"
                                            class="col-xl-3 col-sm-4 mb-0">Price :</label>
                                        <div class="col-xl-8 col-sm-7">
                                            <input class="form-control" id="validationCustom02" name="price"
                                                type="text" placeholde="${product.price.currency.symbol}" value="${product.price.amount}" required="">
                                        </div>
                                        <div class="valid-feedback">Looks good!</div>
                                    </div>
                                    <div class="form-group mb-3 row">
                                        <label for="validationCustomUsername"
                                            class="col-xl-3 col-sm-4 mb-0">Product Code :</label>
                                        <div class="col-xl-8 col-sm-7">
                                            <input class="form-control" id="validationCustomUsername" name="product_code"
                                                type="text" value="${product.product_code}" required="">
                                        </div>
                                        <div class="invalid-feedback offset-sm-4 offset-xl-3">Please
                                            choose Valid Code.</div>
                                    </div>
                                </div>
                                <div class="form">
                                    
                                    <div class="form-group row">
                                        <label class="col-xl-3 col-sm-4 mb-0">Quantity :</label>
                                        <fieldset class="qty-box col-xl-9 col-xl-8 col-sm-7">
                                            <div class="input-group">
                                                <input class="touchspin" type="text" value="${product.quantity}" quantity="1">
                                            </div>
                                        </fieldset>
                                    </div>
                                    
                                    <div class="form-group row">
                                        <label class="col-xl-3 col-md-4">Deal of the Day</label>
                                        <div class="col-md-7">
                                            <div class="checkbox checkbox-primary">
                                                
                                            <input id="checkbox-primary-1" name="is_dealoftheday" type="checkbox" data-original-title="" title="" ${product.is_dealoftheday ? 'checked' : ''}>
                                            
                                            <label for="checkbox-primary-1">YES</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-xl-3 col-md-4">Featured</label>
                                        <div class="col-md-7">
                                            <div class="checkbox checkbox-primary">
                                               
                                            <input id="checkbox-primary-2" name="is_featured" type="checkbox" data-original-title="" title="" ${product.is_featured ? 'checked' : ''}>
                                            
                                            <label for="checkbox-primary-2">YES</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-xl-3 col-md-4">New</label>
                                        <div class="col-md-7">
                                            <div class="checkbox checkbox-primary">
                                                
                                            <input id="checkbox-primary-3" name="is_new" type="checkbox" data-original-title="" title="" ${product.is_new ? 'checked' : ''}>
                                                <label for="checkbox-primary-3">YES</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-xl-3 col-md-4">On Sale</label>
                                        <div class="col-md-7">
                                            <div class="checkbox checkbox-primary">
                                                
                                            <input id="checkbox-primary-4" name="is_onsale" type="checkbox" data-original-title="" title="" ${product.is_onsale ? 'checked' : ''}>
                                            
                                            <label for="checkbox-primary-4">YES</label>
                                            </div>
                                        </div>
                                    </div>
                                   
                                    
                                    <div class="form-group row">
                                        <label class="col-xl-3 col-md-4">Publish</label>
                                        <div class="col-md-7">
                                            <div class="checkbox checkbox-primary">
                                                
                                            <input id="checkbox-primary-5" name="is_published" type="checkbox" data-original-title="" title="" ${product.is_published ? 'checked' : ''}>
                                            
                                            <label for="checkbox-primary-5">YES</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-xl-3 col-sm-4">Add Description :</label>
                                        <div class="col-xl-8 col-sm-7 description-sm">
                                            <textarea id="editor1" name="editor1" cols="10"
                                                rows="4">${product.editor1}</textarea>
                                        </div>
                                        <div class="offset-xl-3 offset-sm-4 mt-4">
                                            <button type="submit" class="btn btn-primary">Save</button>
                                            <!-- <button type="button" class="btn btn-light">Discard</button> -->
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Container-fluid Ends--></div>`

return html

    }