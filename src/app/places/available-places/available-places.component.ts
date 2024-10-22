import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);
  isFetching = signal(true);
  error = signal('');
  places = signal<Place[] | undefined>(undefined);
  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
      next: (places) => {
        this.places.set(places);
      }, // next function to handle next emitted value
      complete: () => {
        this.isFetching.set(false);
      }, // complete function to handle after emiting value
      error: (error: Error) => {
        this.error.set(error.message);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  onSelectPlace(selectedPlace: Place) {
    const subscription =  this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (resData) => console.log(resData),
    });
    this.destroyRef.onDestroy(() => {
       subscription.unsubscribe();
    });
  }
}
