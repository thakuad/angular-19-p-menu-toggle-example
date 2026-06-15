import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

// Type definitions for the Quill Delta structure
interface QuillOp {
  insert?: string | object;
  attributes?: {
    background?: string;
    color?: string;
    [key: string]: any;
  };
}

interface QuillDelta {
  ops: QuillOp[];
}

// Type definition for the PrimeNG modules configuration
interface EditorModules {
  clipboard: {
    matchers: Array<[number, (node: HTMLElement, delta: QuillDelta) => QuillDelta]>;
  };
}

@Component({
  selector: 'app-my-editor',
  templateUrl: './my-editor.component.html'
})
export class MyEditorComponent implements OnInit {
  myForm!: FormGroup;
  editorModules!: EditorModules;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // 1. Initialize your Reactive Form
    this.myForm = this.fb.group({
      editorContent: ['']
    });

    // 2. Define the configuration using the p-editor modules approach
    this.editorModules = {
      clipboard: {
        matchers: [
          [
            Node.ELEMENT_NODE, 
            (node: HTMLElement, delta: QuillDelta): QuillDelta => {
              if (delta && Array.isArray(delta.ops)) {
                delta.ops.forEach((op: QuillOp) => {
                  if (op.attributes) {
                    // Strip color and background info
                    delete op.attributes.background;
                    delete op.attributes.color;
                  }
                });
              }
              return delta;
            }
          ]
        ]
      }
    };
  }
}
