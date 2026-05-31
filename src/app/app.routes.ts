import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/pages/product-list/product-list.component';
import { ProductAddComponent } from './features/products/pages/product-add/product-add.component';

export const routes: Routes = [
	{
		path: '',
		component: ProductListComponent
	},
	{
		path: 'products/add',
		component: ProductAddComponent
	},
	{
		path: 'products/edit/:id',
		component: ProductAddComponent
	},
	{
		path: '**',
		redirectTo: ''
	}
];
