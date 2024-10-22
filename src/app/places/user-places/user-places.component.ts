import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
 
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);
  isFetching = signal(true);
  error = signal('');
  places = this.placesService.loadedUserPlaces;
  ngOnInit() {
    const subscription = this.placesService.loadUserPlaces()
      .subscribe({
        // next: (places) => {
        //   this.places.set(places);
        // }, // next function to handle next emitted value
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
  onRemovePlace(place: Place){
   const subscription = this.placesService.removeUserPlace(place).subscribe();
   this.destroyRef.onDestroy(() => {
    subscription.unsubscribe();
  });

  }
}

