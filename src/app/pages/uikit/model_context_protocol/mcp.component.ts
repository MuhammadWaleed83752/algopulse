import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { McpService } from '../../service/mcp.service';
import { FormsModule } from '@angular/forms';
import { McpResponse } from '../../../models/mcp-response.model';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: 'mcp.component.html',
    styleUrls: ['./mcp.component.css'],
    providers: [],
})
export class MCPServer {
    subscription!: Subscription;
    userInput = signal('');
    response = signal<string | null>(null);

    constructor(private mcpService: McpService) { }

    // Properly typed input handler
    onInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.userInput.set(input.value);
    }



    submit() {
        this.mcpService.askMcp(this.userInput()).subscribe({
            next: (res: McpResponse) => {
                const toolName = res?.tool_calls?.[0]?.tool_name;
                this.response.set(toolName || 'Did not perform well.');
            },
            error: () => this.response.set('Error fetching response from API.')
        });


    }
}